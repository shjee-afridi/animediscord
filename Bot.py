import os
import asyncio
import json
import hashlib
import traceback
import random
import functools
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List, Callable
import aiohttp
import re

import discord
from discord.ext import commands, tasks
from discord import app_commands
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Universal interaction handler to prevent double acknowledgment
def safe_interaction_handler(func: Callable) -> Callable:
    """Decorator to safely handle Discord interactions with automatic defer/response logic"""
    @functools.wraps(func)
    async def wrapper(interaction: discord.Interaction, *args, **kwargs):
        # Track if we've successfully deferred
        deferred = False
        
        try:
            # Try to defer the interaction immediately
            if not interaction.response.is_done():
                await interaction.response.defer(ephemeral=True)
                deferred = True
        except discord.HTTPException:
            # Interaction might already be acknowledged
            deferred = False
        
        # Add helper methods to interaction for easy response handling
        async def safe_send(content=None, embed=None, view=None, ephemeral=True):
            try:
                if deferred:
                    await interaction.followup.send(content=content, embed=embed, view=view, ephemeral=ephemeral)
                else:
                    await interaction.response.send_message(content=content, embed=embed, view=view, ephemeral=ephemeral)
            except discord.HTTPException as e:
                print(f"Failed to send response for interaction {interaction.id}: {e}")
        
        # Attach the helper to the interaction
        interaction.safe_send = safe_send
        interaction.deferred = deferred
        
        # Call the original function
        return await func(interaction, *args, **kwargs)
    
    return wrapper

# Domain configuration - supports both hentaidiscord.com and animediscord.com
DOMAINS = {
    'hentai': 'hentaidiscord.com',
    'anime': 'animediscord.com'
}

class HentaiDiscordBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.guilds = True
        intents.dm_messages = True
        intents.message_content = True  # For better error handling
        
        super().__init__(command_prefix='!', intents=intents)
        
        # MongoDB setup
        self.mongo_uri = os.getenv('MONGODB_URI')
        if not self.mongo_uri:
            print('WARNING: MONGODB_URI environment variable not found!')
        self.mongo_client = None
        self.db = None
        
        # Rate limiting for commands (user_id -> last_used_time)
        self.command_cooldowns = {}
        
        # Performance optimization: Cache frequently accessed data
        self.domain_cache = {}  # Cache domain preferences
        self.server_cache = {}  # Cache server data for 5 minutes
        self.cache_ttl = 300  # 5 minutes cache TTL
        
    def is_rate_limited(self, user_id: int, command: str, cooldown_seconds: int = 3) -> bool:
        """Check if user is rate limited for a command"""
        now = datetime.utcnow()
        key = f"{user_id}_{command}"
        
        if key in self.command_cooldowns:
            time_diff = (now - self.command_cooldowns[key]).total_seconds()
            if time_diff < cooldown_seconds:
                return True
        
        self.command_cooldowns[key] = now
        return False
    
    def clear_expired_cache(self):
        """Clear expired cache entries for better memory management"""
        now = datetime.utcnow().timestamp()
        
        # Clear expired domain cache
        expired_domains = [k for k, v in self.domain_cache.items() 
                          if now - v.get('timestamp', 0) > self.cache_ttl]
        for key in expired_domains:
            del self.domain_cache[key]
        
        # Clear expired server cache
        expired_servers = [k for k, v in self.server_cache.items() 
                          if now - v.get('timestamp', 0) > self.cache_ttl]
        for key in expired_servers:
            del self.server_cache[key]
        
    async def setup_hook(self):
        """Called when the bot is starting up"""
        try:
            await self.connect_mongo()
            print('MongoDB connection established')
        except Exception as e:
            print(f'MongoDB connection failed during setup: {e}')
            
        try:
            await self.sync_commands()
        except Exception as e:
            print(f'Command sync failed during setup: {e}')
        
    async def connect_mongo(self):
        """Connect to MongoDB with better connection pooling"""
        try:
            if self.db is None:
                self.mongo_client = MongoClient(
                    self.mongo_uri,
                    maxPoolSize=100,  # Increased for better performance
                    minPoolSize=10,   # Maintain more minimum connections
                    maxIdleTimeMS=30000,  # Reduced idle time
                    serverSelectionTimeoutMS=3000,  # Faster server selection
                    socketTimeoutMS=15000,  # Reduced for faster timeouts
                    connectTimeoutMS=5000,   # Faster connection timeout
                    retryWrites=True,
                    retryReads=True,
                    w='majority',  # Ensure write acknowledgment
                    readPreference='secondaryPreferred',  # Better read performance
                    compressors='zstd,zlib'  # Enable compression for better network performance
                )
                self.db = self.mongo_client['discord']
                # Test the connection
                self.mongo_client.admin.command('ping')
                print('MongoDB connection established successfully')
            return self.db
        except Exception as error:
            print(f'MongoDB connection failed: {error}')
            self.db = None
            self.mongo_client = None
            return None
    
    async def safe_connect_mongo(self):
        """Safe MongoDB connection with error handling"""
        try:
            return await self.connect_mongo()
        except Exception as error:
            print(f'MongoDB connection failed: {error}')
            self.db = None
            self.mongo_client = None
            return None
    
    async def get_domain_for_guild(self, guild_id: str) -> str:
        """Get the appropriate domain for a guild with caching"""
        # Check cache first
        cache_key = f"domain_{guild_id}"
        now = datetime.utcnow().timestamp()
        
        if cache_key in self.domain_cache:
            cache_entry = self.domain_cache[cache_key]
            if now - cache_entry['timestamp'] < self.cache_ttl:
                return cache_entry['domain']
        
        # 1. Database guild-specific preference (highest priority)
        if guild_id:
            try:
                db = await self.safe_connect_mongo()
                if db is not None:
                    servers = db['servers']
                    # Optimized query with projection to only get what we need
                    server_data = servers.find_one(
                        {'guildId': guild_id}, 
                        {'domainPreference': 1, '_id': 0}
                    )
                    if server_data and server_data.get('domainPreference') and server_data['domainPreference'] in DOMAINS:
                        domain = DOMAINS[server_data['domainPreference']]
                        # Cache the result
                        self.domain_cache[cache_key] = {
                            'domain': domain,
                            'timestamp': now
                        }
                        return domain
            except Exception as e:
                print(f'Could not fetch guild domain preference from database: {e}')
        
        # 2. Environment variable override (for global preference)
        preferred_domain = os.getenv('PREFERRED_DOMAIN')
        if preferred_domain:
            domain = DOMAINS.get(preferred_domain.lower())
            if domain:
                # Cache the result
                self.domain_cache[cache_key] = {
                    'domain': domain,
                    'timestamp': now
                }
                return domain
        
        # 3. Guild-specific domain mapping from env
        if guild_id:
            guild_domain_mapping = os.getenv('GUILD_DOMAIN_MAPPING')
            if guild_domain_mapping:
                try:
                    mapping = json.loads(guild_domain_mapping)
                    if guild_id in mapping:
                        domain = DOMAINS.get(mapping[guild_id].lower())
                        if domain:
                            # Cache the result
                            self.domain_cache[cache_key] = {
                                'domain': domain,
                                'timestamp': now
                            }
                            return domain
                except Exception as e:
                    print(f'Invalid GUILD_DOMAIN_MAPPING format: {e}')
        
        # 4. Load balancing: alternate domains based on guild ID hash
        if guild_id and os.getenv('LOAD_BALANCE_DOMAINS') == 'true':
            hash_val = sum(ord(c) for c in guild_id) % len(DOMAINS)
            domain = list(DOMAINS.values())[hash_val]
            # Cache the result
            self.domain_cache[cache_key] = {
                'domain': domain,
                'timestamp': now
            }
            return domain
        
        # 5. Default fallback
        domain = DOMAINS['hentai']
        # Cache the result
        self.domain_cache[cache_key] = {
            'domain': domain,
            'timestamp': now
        }
        return domain
    
    def get_domain_for_guild_sync(self, guild_id: str = None) -> str:
        """Synchronous version for cases where we can't use async"""
        # Environment variable override
        preferred_domain = os.getenv('PREFERRED_DOMAIN')
        if preferred_domain:
            domain = DOMAINS.get(preferred_domain.lower())
            if domain:
                return domain
        
        # Guild-specific domain mapping from env
        if guild_id:
            guild_domain_mapping = os.getenv('GUILD_DOMAIN_MAPPING')
            if guild_domain_mapping:
                try:
                    mapping = json.loads(guild_domain_mapping)
                    if guild_id in mapping:
                        domain = DOMAINS.get(mapping[guild_id].lower())
                        if domain:
                            return domain
                except Exception as e:
                    print(f'Invalid GUILD_DOMAIN_MAPPING format: {e}')
        
        # Load balancing
        if guild_id and os.getenv('LOAD_BALANCE_DOMAINS') == 'true':
            hash_val = sum(ord(c) for c in guild_id) % len(DOMAINS)
            return list(DOMAINS.values())[hash_val]
        
        # Default fallback
        return DOMAINS['hentai']
    
    async def get_server_data_cached(self, guild_id: str) -> dict:
        """Get server data with caching for better performance"""
        cache_key = f"server_{guild_id}"
        now = datetime.utcnow().timestamp()
        
        # Check cache first
        if cache_key in self.server_cache:
            cache_entry = self.server_cache[cache_key]
            if now - cache_entry['timestamp'] < self.cache_ttl:
                return cache_entry['data']
        
        # Fetch from database
        try:
            db = await self.safe_connect_mongo()
            if db is not None:
                servers = db['servers']
                server_data = servers.find_one({'guildId': guild_id})
                
                # Cache the result (even if None)
                self.server_cache[cache_key] = {
                    'data': server_data,
                    'timestamp': now
                }
                return server_data
        except Exception as e:
            print(f'Error fetching server data for {guild_id}: {e}')
        
        return None
    
    def invalidate_server_cache(self, guild_id: str):
        """Invalidate server cache for a specific guild"""
        cache_key = f"server_{guild_id}"
        if cache_key in self.server_cache:
            del self.server_cache[cache_key]
    
    def get_bot_invite_link(self) -> str:
        """Generate bot invite link with proper permissions"""
        bot_id = self.user.id if self.user else "YOUR_BOT_ID"
        # Permissions calculation:
        # - View Channels (1024)
        # - Send Messages (2048) 
        # - Embed Links (16384)
        # - Read Message History (65536)
        # - Use Slash Commands (2147483648)
        # - Use External Emojis (262144)
        # Total: 277025508416
        permissions = 277025508416
        return f"https://discord.com/api/oauth2/authorize?client_id={bot_id}&permissions={permissions}&scope=bot%20applications.commands"
    
    async def sync_commands(self):
        """Sync slash commands"""
        try:
            synced = await self.tree.sync()
            print(f'Synced {len(synced)} command(s)')
        except Exception as e:
            print(f'Failed to sync commands: {e}')
    
    async def on_ready(self):
        """Called when the bot is ready"""
        try:
            print(f'Logged in as {self.user}')
            
            # Set presence
            domain = self.get_domain_for_guild_sync()
            await self.change_presence(
                activity=discord.Game(name=f'https://www.{domain}'),
                status=discord.Status.online
            )
            
            # Start loops
            if not self.reminder_loop.is_running():
                self.reminder_loop.start()
            if not self.cross_ad_loop.is_running():
                self.cross_ad_loop.start()
            if not self.cleanup_loop.is_running():
                self.cleanup_loop.start()
                
            print('Bot is ready and all tasks started successfully!')
        except Exception as e:
            print(f'Error in on_ready: {e}')
    
    @tasks.loop(minutes=1)
    async def reminder_loop(self):
        """Check for due reminders every minute"""
        try:
            db = await self.safe_connect_mongo()
            if db is None:
                return
            
            reminders = db['bump_reminders']
            bot_reminders = db['bot_bump_reminders']
            now = datetime.utcnow()
            
            # Website bump reminders
            due_reminders = reminders.find({
                'remindAt': {'$lte': now},
                'enabled': True
            })
            
            for reminder in due_reminders:
                try:
                    user = await self.fetch_user(reminder['userId'])
                    if user:
                        domain = await self.get_domain_for_guild(reminder['guildId'])
                        embed = discord.Embed(
                            title="⏰ Website Bump Reminder",
                            description=f"It's time to bump your server on the website!",
                            color=0x00ff00,
                            timestamp=now
                        )
                        embed.add_field(
                            name="Server Page",
                            value=f"[Click here to bump](https://www.{domain}/server/{reminder['guildId']})",
                            inline=False
                        )
                        embed.set_footer(text="You can disable these reminders on the website")
                        
                        await user.send(embed=embed)
                except Exception as e:
                    print(f'Failed to send website bump reminder: {e}')
                
                # Remove the reminder
                reminders.delete_one({'_id': reminder['_id']})
            
            # Bot bump reminders (2 hour cooldown)
            due_bot_reminders = bot_reminders.find({
                'remindAt': {'$lte': now},
                'enabled': True
            })
            
            for reminder in due_bot_reminders:
                try:
                    user = await self.fetch_user(reminder['userId'])
                    guild = await self.fetch_guild(reminder['guildId'])
                    if user and guild:
                        # Check if there are actually other servers to bump to
                        servers = db['servers']
                        other_servers = list(servers.find({
                            'guildId': {'$ne': reminder['guildId']},
                            'crossAdEnabled': True,
                            'crossAdChannelId': {'$exists': True}
                        }))
                        
                        # Only send reminder if there are other servers available
                        if other_servers:
                            embed = discord.Embed(
                                title="⏰ Bot Bump Reminder",
                                description=f"You can now use `/bump` for **{guild.name}**!",
                                color=0x5865F2,
                                timestamp=now
                            )
                            embed.add_field(
                                name="What to do",
                                value=f"Go to **{guild.name}** and run `/bump` to advertise your server to other communities!",
                                inline=False
                            )
                            embed.add_field(
                                name="Network Status",
                                value=f"📈 {len(other_servers)} server(s) ready to receive your ad",
                                inline=False
                            )
                            embed.set_footer(text="Use /toggle_bot_reminders to disable these reminders")
                            
                            await user.send(embed=embed)
                        # If no other servers, don't send reminder but still clean up the record
                except Exception as e:
                    print(f'Failed to send bot bump reminder: {e}')
                
                # Remove the reminder regardless of whether we sent it or not
                bot_reminders.delete_one({'_id': reminder['_id']})
                
        except Exception as e:
            print(f'Reminder loop error: {e}')
    
    @tasks.loop(hours=1)
    async def cross_ad_loop(self):
        """Hourly cross-advertising logic"""
        try:
            db = await self.safe_connect_mongo()
            if db is None:
                print('Skipping cross-ad check - database unavailable')
                return
            
            servers = db['servers']
            all_servers = list(servers.find({
                'crossAdEnabled': True,
                'crossAdChannelId': {'$exists': True}
            }))
            
            if len(all_servers) < 2:
                return
            
            # For each server, pick a random other server to post
            for srv in all_servers:
                # First, validate that the receiving server's channel still exists
                has_perms, perm_reason = await self.check_channel_permissions(srv['crossAdChannelId'])
                if not has_perms:
                    print(f'Receiving server channel validation failed for {srv["guildId"]} channel {srv["crossAdChannelId"]}: {perm_reason}')
                    await self.disable_cross_ad_for_server(srv['guildId'], reason=perm_reason)
                    continue
                
                # Get eligible servers (excluding self) that can send ads
                potential_senders = [s for s in all_servers if s['guildId'] != srv['guildId']]
                if not potential_senders:
                    continue
                
                # Validate that at least one sender has a working channel
                valid_senders = []
                for sender in potential_senders:
                    sender_has_perms, sender_reason = await self.check_channel_permissions(sender['crossAdChannelId'])
                    if sender_has_perms:
                        valid_senders.append(sender)
                    else:
                        print(f'Sender channel validation failed for {sender["guildId"]}: {sender_reason}')
                        await self.disable_cross_ad_for_server(sender['guildId'], reason=f"Sender validation: {sender_reason}")
                
                if not valid_senders:
                    continue
                
                # Pick a random valid sender
                ad_server = random.choice(valid_senders)
                
                # Build ad embed
                embed, view = await self.build_ad_embed(ad_server)
                
                # Send the ad (we already validated permissions above)
                try:
                    channel = await self.fetch_channel(srv['crossAdChannelId'])
                    if channel and hasattr(channel, 'send'):
                        if view:
                            await channel.send(embed=embed, view=view)
                        else:
                            await channel.send(embed=embed)
                except discord.Forbidden as e:
                    print(f'Permission denied for channel {srv["crossAdChannelId"]}: {e}')
                    # Disable cross-ad for this server due to permission issues
                    await self.disable_cross_ad_for_server(srv['guildId'], reason='Permission denied')
                except discord.NotFound as e:
                    print(f'Channel {srv["crossAdChannelId"]} not found: {e}')
                    # Disable cross-ad for this server as the channel no longer exists
                    await self.disable_cross_ad_for_server(srv['guildId'], reason='Channel not found')
                except discord.HTTPException as e:
                    print(f'HTTP error sending cross-ad to channel {srv["crossAdChannelId"]}: {e}')
                except Exception as e:
                    print(f'Unexpected error sending cross-ad to channel {srv["crossAdChannelId"]}: {e}')
                    
        except Exception as e:
            print(f'Cross-ad loop error: {e}')
    
    @tasks.loop(hours=24)
    async def cleanup_loop(self):
        """Daily cleanup of old records and cache optimization"""
        try:
            db = await self.safe_connect_mongo()
            if db is None:
                return
            
            # Clean up old bot bumps (older than 30 days) - Use bulk delete for better performance
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            result = db['bot_bumps'].delete_many({'bumpedAt': {'$lt': thirty_days_ago}})
            if result.deleted_count > 0:
                print(f'Cleaned up {result.deleted_count} old bot bump records')
            
            # Clean up old reminders (older than 7 days)
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            result = db['bot_bump_reminders'].delete_many({'createdAt': {'$lt': seven_days_ago}})
            if result.deleted_count > 0:
                print(f'Cleaned up {result.deleted_count} old reminder records')
            
            # Validate cross-advertising channels and clean up invalid ones
            await self.validate_cross_ad_channels()
            
            # Clear expired cache entries for memory optimization
            self.clear_expired_cache()
            print(f'Cache cleanup completed. Domain cache: {len(self.domain_cache)} entries, Server cache: {len(self.server_cache)} entries')
                
        except Exception as e:
            print(f'Cleanup loop error: {e}')
    
    @reminder_loop.before_loop
    async def before_reminder_loop(self):
        await self.wait_until_ready()
        print('Reminder loop is starting...')
    
    @cross_ad_loop.before_loop
    async def before_cross_ad_loop(self):
        await self.wait_until_ready()
        print('Cross-ad loop is starting...')
    
    @cleanup_loop.before_loop
    async def before_cleanup_loop(self):
        await self.wait_until_ready()
        print('Cleanup loop is starting...')
    
    @reminder_loop.error
    async def reminder_loop_error(self, error):
        print(f'Reminder loop error: {error}')
        traceback.print_exc()
    
    @cross_ad_loop.error
    async def cross_ad_loop_error(self, error):
        print(f'Cross-ad loop error: {error}')
        traceback.print_exc()
    
    @cleanup_loop.error
    async def cleanup_loop_error(self, error):
        print(f'Cleanup loop error: {error}')
        traceback.print_exc()
    
    async def disable_cross_ad_for_server(self, guild_id: str, reason: str = 'Permission issues'):
        """Disable cross-advertising for a server due to permission or access issues"""
        try:
            db = await self.safe_connect_mongo()
            if db is None:
                return
            
            servers = db['servers']
            
            # Get guild name for better logging
            guild_name = "Unknown"
            try:
                guild = self.get_guild(int(guild_id))
                if guild:
                    guild_name = guild.name
            except:
                pass
            
            result = servers.update_one(
                {'guildId': guild_id},
                {
                    '$set': {
                        'crossAdEnabled': False,
                        'crossAdDisabledReason': reason,
                        'crossAdDisabledAt': datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f'🚫 Disabled cross-advertising for server "{guild_name}" ({guild_id}): {reason}')
                # Invalidate cache for this server
                self.invalidate_server_cache(guild_id)
            
        except Exception as e:
            print(f'Error disabling cross-ad for server {guild_id}: {e}')
    
    async def check_channel_permissions(self, channel_id: int) -> tuple[bool, str]:
        """Check if the bot has required permissions in a channel"""
        try:
            # Convert to int if it's a string
            if isinstance(channel_id, str):
                try:
                    channel_id = int(channel_id)
                except ValueError:
                    return False, "Invalid channel ID format"
            
            channel = await self.fetch_channel(channel_id)
            if not channel:
                return False, "Channel not found or deleted"
            
            # Check if the bot is still in the guild
            if not channel.guild:
                return False, "Guild not found"
            
            # Check if bot is still a member of the guild
            if not channel.guild.me:
                return False, "Bot not in guild"
            
            if not hasattr(channel, 'permissions_for'):
                return False, "Cannot check permissions for this channel type"
            
            permissions = channel.permissions_for(channel.guild.me)
            
            if not permissions.view_channel:
                return False, "Missing 'View Channel' permission"
            
            if not permissions.send_messages:
                return False, "Missing 'Send Messages' permission"
            
            if not permissions.embed_links:
                return False, "Missing 'Embed Links' permission"
            
            return True, "All permissions available"
            
        except discord.Forbidden:
            return False, "Access forbidden - bot may be banned or lacks permissions"
        except discord.NotFound:
            return False, "Channel deleted or not found"
        except discord.HTTPException as e:
            return False, f"Discord API error: {e}"
        except Exception as e:
            return False, f"Unexpected error: {e}"
    
    async def validate_cross_ad_channels(self):
        """Validate all cross-advertising channels and disable invalid ones"""
        try:
            db = await self.safe_connect_mongo()
            if db is None:
                return
            
            servers = db['servers']
            enabled_servers = list(servers.find({
                'crossAdEnabled': True,
                'crossAdChannelId': {'$exists': True}
            }))
            
            if not enabled_servers:
                return
            
            disabled_count = 0
            total_checked = len(enabled_servers)
            
            print(f'🔍 Validating {total_checked} cross-advertising channel(s)...')
            
            for srv in enabled_servers:
                channel_id = srv.get('crossAdChannelId')
                if not channel_id:
                    continue
                
                has_perms, reason = await self.check_channel_permissions(channel_id)
                if not has_perms:
                    await self.disable_cross_ad_for_server(srv['guildId'], reason=f"Validation failed: {reason}")
                    disabled_count += 1
            
            if disabled_count > 0:
                print(f'🧹 Disabled cross-advertising for {disabled_count} server(s) with invalid channels')
            else:
                print(f'✅ All {total_checked} cross-advertising channel(s) are valid')
                
        except Exception as e:
            print(f'Error during channel validation: {e}')
    
    def is_valid_hex_color(self, color_str: str) -> bool:
        """Check if string is a valid hex color"""
        if not isinstance(color_str, str):
            return False
        return bool(re.match(r'^#([0-9A-Fa-f]{6})$', color_str))
    
    def is_valid_url(self, url_str: str) -> bool:
        """Check if string is a valid URL"""
        if not isinstance(url_str, str):
            return False
        return bool(re.match(r'^https?://', url_str))
    
    def is_valid_discord_invite(self, url: str) -> bool:
        """Check if URL is a valid Discord invite"""
        if not isinstance(url, str):
            return False
        return url.startswith('https://discord.gg/') or url.startswith('https://discord.com/invite/')
    
    async def build_ad_embed(self, ad_data: Dict[str, Any], guild_fallback: discord.Guild = None):
        """Build a visually appealing ad embed"""
        # Fallbacks
        color = ad_data.get('colorTheme', '#5865F2')
        if not self.is_valid_hex_color(color):
            color = '#5865F2'
        
        guild_id = ad_data.get('guildId') or (guild_fallback.id if guild_fallback else None)
        icon = ad_data.get('icon') or (guild_fallback.icon.url if guild_fallback and guild_fallback.icon else None)
        banner = ad_data.get('banner') or ad_data.get('splash')
        
        # Build icon URL if it's a hash
        if icon and not self.is_valid_url(icon) and guild_id:
            icon = f"https://cdn.discordapp.com/icons/{guild_id}/{icon}.png"
        if not self.is_valid_url(icon):
            icon = None
        
        # Build banner URL
        banner_url = None
        if banner and guild_id:
            if not self.is_valid_url(banner):
                if ad_data.get('banner'):
                    banner_url = f"https://cdn.discordapp.com/banners/{guild_id}/{ad_data['banner']}.png?size=4096"
                elif ad_data.get('splash'):
                    banner_url = f"https://cdn.discordapp.com/splashes/{guild_id}/{ad_data['splash']}.png?size=4096"
            else:
                banner_url = f"{banner}?size=4096" if '?' not in banner else banner
        
        if not self.is_valid_url(banner_url):
            banner_url = None
        
        # Build embed
        description = ad_data.get('shortDescription') or ad_data.get('description') or 'No description set.'
        name = ad_data.get('name') or (guild_fallback.name if guild_fallback else 'Server')
        language = ad_data.get('language', 'Unknown')
        categories = ', '.join(ad_data.get('categories', [])) if ad_data.get('categories') else 'None'
        
        average_rating = 'Unrated'
        if isinstance(ad_data.get('averageRating'), (int, float)) and not isinstance(ad_data.get('averageRating'), bool):
            average_rating = f"{ad_data['averageRating']:.1f} ⭐"
        elif ad_data.get('averageRating'):
            average_rating = f"{ad_data['averageRating']} ⭐"
        
        # Get invite
        invite = ad_data.get('invite') or ad_data.get('link')
        if not invite and ad_data.get('inviteCode'):
            invite = f"https://discord.gg/{ad_data['inviteCode']}"
        
        print(f'[build_ad_embed] invite: {invite}, type: {type(invite)}')
        
        # Create embed
        embed = discord.Embed(
            title=f"🚀 {name}",
            description=description,
            color=int(color[1:], 16) if color.startswith('#') else 0x5865F2,
            timestamp=datetime.utcnow()
        )
        
        if icon:
            embed.set_thumbnail(url=icon)
        if banner_url:
            embed.set_image(url=banner_url)
        
        embed.add_field(name='🌐 Language', value=language, inline=True)
        embed.add_field(name='📂 Categories', value=categories, inline=True)
        embed.add_field(name='⭐ Rating', value=average_rating, inline=True)
        
        # Add member count if available from guild_fallback
        if guild_fallback:
            embed.add_field(name='👥 Members', value=f"{guild_fallback.member_count:,}", inline=True)
        
        # Add boost level if available
        if guild_fallback and hasattr(guild_fallback, 'premium_tier'):
            boost_levels = {0: "No Boost", 1: "Level 1", 2: "Level 2", 3: "Level 3"}
            embed.add_field(
                name='💎 Boost Level', 
                value=boost_levels.get(guild_fallback.premium_tier, "Unknown"), 
                inline=True
            )
        
        embed.set_footer(text="Cross-advertising powered by HentaiDiscord & AnimeDiscord")
        
        # Create view with buttons
        view = None
        if self.is_valid_discord_invite(invite) and guild_id:
            domain = await self.get_domain_for_guild(guild_id)
            view = AdView(invite, f"https://www.{domain}/server/{guild_id}")
        elif self.is_valid_discord_invite(invite):
            view = AdView(invite)
        elif guild_id:
            domain = await self.get_domain_for_guild(guild_id)
            view = AdView(visit_url=f"https://www.{domain}/server/{guild_id}")
        
        return embed, view


class AdView(discord.ui.View):
    def __init__(self, join_url: str = None, visit_url: str = None):
        super().__init__(timeout=None)
        
        if join_url:
            join_button = discord.ui.Button(
                label='Join',
                style=discord.ButtonStyle.link,
                url=join_url
            )
            self.add_item(join_button)
        
        if visit_url:
            visit_button = discord.ui.Button(
                label='Visit Server Page',
                style=discord.ButtonStyle.link,
                url=visit_url
            )
            self.add_item(visit_button)


# Initialize bot
bot = HentaiDiscordBot()

# Slash commands
@bot.tree.command(name='setadchannel', description='Set the channel for cross-advertising ads')
@app_commands.describe(channel='Channel to post ads in')
async def set_ad_channel(interaction: discord.Interaction, channel: discord.TextChannel):
    # Check permissions
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            'You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    # Check channel permissions
    guild = interaction.guild
    everyone = guild.default_role
    largest_role = max(guild.roles, key=lambda r: len(r.members))
    
    perms = channel.permissions_for(everyone)
    perms2 = channel.permissions_for(largest_role)
    
    if not (perms.view_channel and perms.read_message_history and 
            perms2.view_channel and perms2.read_message_history):
        await interaction.response.send_message(
            'Channel must be viewable and have Read Message History for @everyone and the largest role.',
            ephemeral=True
        )
        return
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        servers = db['servers']
        
        # Check if server is listed on the website using cached lookup
        server_doc = await bot.get_server_data_cached(str(guild.id))
        if not server_doc:
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server must be listed on our website before you can configure cross-advertising.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    "• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    "• **Not listed yet?** Add your server at:\n"
                    "  - https://hentaidiscord.com/add-server\n"
                    "  - https://animediscord.com/add-server"
                ),
                inline=False
            )
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        servers.update_one(
            {'guildId': str(guild.id)},
            {'$set': {'crossAdChannelId': str(channel.id)}}
        )
        
        # Invalidate cache since we updated the server
        bot.invalidate_server_cache(str(guild.id))
        
        # Validate the channel setup
        has_perms, perm_reason = await bot.check_channel_permissions(channel.id)
        
        if has_perms:
            await interaction.response.send_message(
                f'✅ Ad channel set to {channel.mention} and permissions verified!\n\n'
                f'Use `/enablecrossad True` to enable cross-advertising, then test with `/validatechannel`.',
                ephemeral=True
            )
        else:
            await interaction.response.send_message(
                f'⚠️ Ad channel set to {channel.mention}, but there\'s a permission issue:\n'
                f'**{perm_reason}**\n\n'
                f'Please fix the permissions and use `/validatechannel` to test again.',
                ephemeral=True
            )
    except Exception as error:
        print(f'Database error in setadchannel: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


@bot.tree.command(name='enablecrossad', description='Enable or disable cross-advertising for this server')
@app_commands.describe(enabled='Enable or disable cross-advertising')
async def enable_cross_ad(interaction: discord.Interaction, enabled: bool):
    # Check permissions
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            'You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        servers = db['servers']
        
        # Check if server is listed on the website using cached lookup
        server_doc = await bot.get_server_data_cached(str(interaction.guild.id))
        if not server_doc:
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server must be listed on our website before you can configure cross-advertising.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    "• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    "• **Not listed yet?** Add your server at:\n"
                    "  - https://hentaidiscord.com/add-server\n"
                    "  - https://animediscord.com/add-server"
                ),
                inline=False
            )
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        servers.update_one(
            {'guildId': str(interaction.guild.id)},
            {
                '$set': {'crossAdEnabled': enabled},
                '$unset': {
                    'crossAdDisabledReason': '',
                    'crossAdDisabledAt': ''
                } if enabled else {}
            }
        )
        
        # Invalidate cache since we updated the server
        bot.invalidate_server_cache(str(interaction.guild.id))
        
        status = 'enabled' if enabled else 'disabled'
        await interaction.response.send_message(
            f'Cross-advertising {status} for this server.',
            ephemeral=True
        )
    except Exception as error:
        print(f'Database error in enablecrossad: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


@bot.tree.command(name='domain', description='Check which domain your server is using or set a preference')
@app_commands.describe(set_domain='Set domain preference for this server')
@app_commands.choices(set_domain=[
    app_commands.Choice(name='HentaiDiscord.com', value='hentai'),
    app_commands.Choice(name='AnimeDiscord.com', value='anime'),
    app_commands.Choice(name='Auto (load balanced)', value='auto')
])
async def domain_command(interaction: discord.Interaction, set_domain: str = None):
    # Check permissions for setting domain
    if set_domain and not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            'You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        servers = db['servers']
        
        # Check if server is listed on the website using cached lookup
        server_doc = await bot.get_server_data_cached(str(interaction.guild.id))
        if not server_doc:
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server must be listed on our website before you can configure domain preferences.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    "• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    "• **Not listed yet?** Add your server at:\n"
                    "  - https://hentaidiscord.com/add-server\n"
                    "  - https://animediscord.com/add-server"
                ),
                inline=False
            )
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        if set_domain:
            # Set domain preference
            if set_domain == 'auto':
                servers.update_one(
                    {'guildId': str(interaction.guild.id)},
                    {'$unset': {'domainPreference': ""}}
                )
                # Invalidate caches since we updated the server
                bot.invalidate_server_cache(str(interaction.guild.id))
                cache_key = f"domain_{str(interaction.guild.id)}"
                if cache_key in bot.domain_cache:
                    del bot.domain_cache[cache_key]
                
                await interaction.response.send_message(
                    'Domain preference cleared. Your server will use automatic domain selection.',
                    ephemeral=True
                )
            else:
                servers.update_one(
                    {'guildId': str(interaction.guild.id)},
                    {'$set': {'domainPreference': set_domain}}
                )
                # Invalidate caches since we updated the server
                bot.invalidate_server_cache(str(interaction.guild.id))
                cache_key = f"domain_{str(interaction.guild.id)}"
                if cache_key in bot.domain_cache:
                    del bot.domain_cache[cache_key]
                
                domain_name = 'HentaiDiscord.com' if set_domain == 'hentai' else 'AnimeDiscord.com'
                await interaction.response.send_message(
                    f'Domain preference set to {domain_name}.',
                    ephemeral=True
                )
        else:
            # Show current domain
            current_domain = await bot.get_domain_for_guild(str(interaction.guild.id))
            server_data = servers.find_one({'guildId': str(interaction.guild.id)})
            has_preference = server_data.get('domainPreference') if server_data else None
            
            message = f'Your server is currently using: **{current_domain}**\n'
            if has_preference:
                domain_name = 'HentaiDiscord.com' if has_preference == 'hentai' else 'AnimeDiscord.com'
                message += f'Domain preference: **{domain_name}**'
            else:
                message += 'Domain preference: **Auto (load balanced)**'
            
            await interaction.response.send_message(message, ephemeral=True)
            
    except Exception as error:
        print(f'Database error in domain: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


@bot.tree.command(name='bump', description='Send your server ad to all other cross-advertising servers')
async def bump_command(interaction: discord.Interaction):
    # Rate limiting
    if bot.is_rate_limited(interaction.user.id, 'bump', 5):
        await interaction.response.send_message(
            '⏱️ Please wait a moment before using this command again.',
            ephemeral=True
        )
        return
    
    await interaction.response.defer(ephemeral=True)
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.followup.send('Database temporarily unavailable. Please try again later.')
            return
        
        servers = db['servers']
        
        # Check if server exists in database first
        server_in_db = servers.find_one({'guildId': str(interaction.guild.id)})
        
        if not server_in_db:
            domain = await bot.get_domain_for_guild(str(interaction.guild.id))
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server is not listed on the website yet.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    f"• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    f"• **Add your server**: [Visit here](https://www.{domain}/add-server)\n"
                    f"• **Need help?** Use `/help` for more information"
                ),
                inline=False
            )
            embed.add_field(
                name="⚡ Quick Setup Steps:",
                value=(
                    "1. **Add server** to website\n"
                    "2. **Wait for approval** (if required)\n"
                    "3. **Use `/setup`** to configure cross-advertising"
                ),
                inline=False
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Check if server has cross-advertising enabled
        this_server = servers.find_one({
            'guildId': str(interaction.guild.id),
            'crossAdEnabled': True,
            'crossAdChannelId': {'$exists': True}
        })
        
        if not this_server:
            # Check if it's a configuration issue vs server not being listed
            if server_in_db.get('crossAdEnabled') is False or not server_in_db.get('crossAdChannelId'):
                await interaction.followup.send(
                    '❌ **Cross-Advertising Not Configured**\n\n'
                    'Your server is listed on the website but cross-advertising is not set up yet.\n\n'
                    '**To configure cross-advertising:**\n'
                    '1. **Set ad channel**: Use `/setadchannel #channel`\n'
                    '2. **Enable cross-advertising**: Use `/enablecrossad True`\n'
                    '3. **Return here** and run `/bump` again\n\n'
                    'Need help? Use `/setup` for a guided setup process.'
                )
            else:
                await interaction.followup.send('❌ Cross-advertising is not enabled or ad channel not set for this server.\n\nUse `/setadchannel` and `/enablecrossad` to set up cross-advertising.')
            return
        
        # IMPORTANT: Validate that our own channel still exists and we have permissions
        # This prevents servers from sending ads when they can't receive them back
        our_channel_id = this_server.get('crossAdChannelId')
        if our_channel_id:
            has_our_perms, our_perm_reason = await bot.check_channel_permissions(our_channel_id)
            if not has_our_perms:
                # Auto-disable cross-advertising since our channel is invalid
                await bot.disable_cross_ad_for_server(str(interaction.guild.id), reason=f"Own channel invalid: {our_perm_reason}")
                
                embed = discord.Embed(
                    title="❌ Cross-Advertising Channel Issue",
                    description="Your cross-advertising channel has a problem and cross-advertising has been disabled.",
                    color=0xff0000,
                    timestamp=datetime.utcnow()
                )
                embed.add_field(
                    name="🚨 Issue Found",
                    value=f"**{our_perm_reason}**",
                    inline=False
                )
                embed.add_field(
                    name="🛠️ How to fix:",
                    value=(
                        "1. **Fix the channel issue** (restore deleted channel, fix permissions, etc.)\n"
                        "2. **Set a new channel**: `/setadchannel #your-channel`\n"
                        "3. **Re-enable cross-advertising**: `/enablecrossad True`\n"
                        "4. **Test your setup**: `/validatechannel`"
                    ),
                    inline=False
                )
                embed.add_field(
                    name="ℹ️ Why this matters",
                    value="Cross-advertising requires that you can both send AND receive ads. If your channel doesn't work, it's not fair to other servers.",
                    inline=False
                )
                
                await interaction.followup.send(embed=embed)
                return
        
        # Check 2-hour cooldown
        bot_bumps = db['bot_bumps']
        last_bump = bot_bumps.find_one(
            {'guildId': str(interaction.guild.id)},
            sort=[('bumpedAt', -1)]
        )
        
        now = datetime.utcnow()
        if last_bump and last_bump.get('bumpedAt'):
            time_diff = now - last_bump['bumpedAt']
            if time_diff < timedelta(hours=2):  # Changed to 2 hours
                next_bump = last_bump['bumpedAt'] + timedelta(hours=2)
                mins = int((next_bump - now).total_seconds() / 60)
                
                # Create cooldown embed
                embed = discord.Embed(
                    title="⏰ Bump Cooldown",
                    description=f"You can bump again in **{mins} minute(s)**",
                    color=0xff9900,
                    timestamp=next_bump
                )
                embed.add_field(
                    name="Next Bump Available",
                    value=f"<t:{int(next_bump.timestamp())}:R>",
                    inline=False
                )
                embed.set_footer(text="Use /toggle_bot_reminders to get notified when you can bump again")
                
                await interaction.followup.send(embed=embed)
                return
        
        # Get other servers
        other_servers = list(servers.find({
            'guildId': {'$ne': str(interaction.guild.id)},
            'crossAdEnabled': True,
            'crossAdChannelId': {'$exists': True}
        }))
        
        if not other_servers:
            await interaction.followup.send('❌ No other servers are currently opted in for cross-advertising.')
            return
        
        # Build and send ad
        embed, view = await bot.build_ad_embed(this_server, interaction.guild)
        
        sent_count = 0
        failed_count = 0
        permission_failures = 0
        channel_not_found = 0
        
        for srv in other_servers:
            try:
                # Check permissions first to avoid unnecessary API calls
                has_perms, perm_reason = await bot.check_channel_permissions(int(srv['crossAdChannelId']))
                if not has_perms:
                    failed_count += 1
                    if "not found" in perm_reason.lower() or "deleted" in perm_reason.lower():
                        channel_not_found += 1
                        # Auto-disable cross-advertising for servers with deleted channels
                        await bot.disable_cross_ad_for_server(srv['guildId'], reason=perm_reason)
                    else:
                        permission_failures += 1
                    print(f'Permission check failed for server {srv["guildId"]} channel {srv["crossAdChannelId"]}: {perm_reason}')
                    continue
                
                channel = await bot.fetch_channel(int(srv['crossAdChannelId']))
                if channel and hasattr(channel, 'send'):
                    if view:
                        await channel.send(embed=embed, view=view)
                    else:
                        await channel.send(embed=embed)
                    sent_count += 1
                else:
                    failed_count += 1
                    print(f'Channel {srv["crossAdChannelId"]} not accessible for server {srv["guildId"]}')
                    
            except discord.Forbidden as e:
                failed_count += 1
                permission_failures += 1
                print(f'Permission denied for server {srv["guildId"]} channel {srv["crossAdChannelId"]}: {e}')
                # Auto-disable cross-advertising for servers with permission issues
                await bot.disable_cross_ad_for_server(srv['guildId'], reason='Permission denied during bump')
            except discord.NotFound as e:
                failed_count += 1
                channel_not_found += 1
                print(f'Channel not found for server {srv["guildId"]} channel {srv["crossAdChannelId"]}: {e}')
                # Auto-disable cross-advertising for servers with deleted channels
                await bot.disable_cross_ad_for_server(srv['guildId'], reason='Channel not found during bump')
            except Exception as e:
                failed_count += 1
                print(f'Unexpected error sending ad to server {srv["guildId"]}: {e}')
        
        # Record bump
        bot_bumps.insert_one({
            'guildId': str(interaction.guild.id),
            'bumpedAt': now,
            'userId': str(interaction.user.id)
        })
        
        # Only create bot reminder if bump was successful and user wants reminders
        if sent_count > 0:
            user_settings = db['user_settings']
            user_setting = user_settings.find_one({'userId': str(interaction.user.id)})
            
            if user_setting and user_setting.get('botRemindersEnabled', False):
                # Create bot bump reminder for 2 hours from now
                bot_reminders = db['bot_bump_reminders']
                remind_time = now + timedelta(hours=2)
                
                bot_reminders.insert_one({
                    'userId': str(interaction.user.id),
                    'guildId': str(interaction.guild.id),
                    'remindAt': remind_time,
                    'enabled': True,
                    'createdAt': now
                })
        
        # Success embed
        success_embed = discord.Embed(
            title="✅ Bump Successful!" if sent_count > 0 else "⚠️ Bump Completed",
            description=f"Your server ad was sent to **{sent_count}** server(s)!",
            color=0x00ff00 if sent_count > 0 else 0xff9900,
            timestamp=now
        )
        
        if failed_count > 0:
            failure_details = []
            if permission_failures > 0:
                failure_details.append(f"• {permission_failures} permission issue(s)")
            if channel_not_found > 0:
                failure_details.append(f"• {channel_not_found} deleted channel(s)")
            if failed_count > permission_failures + channel_not_found:
                failure_details.append(f"• {failed_count - permission_failures - channel_not_found} other issue(s)")
            
            success_embed.add_field(
                name="⚠️ Some servers couldn't receive your ad:",
                value="\n".join(failure_details) + "\n\n*Problematic servers have been automatically disabled from cross-advertising.*",
                inline=False
            )
        
        next_bump = now + timedelta(hours=2)
        success_embed.add_field(
            name="Next Bump",
            value=f"<t:{int(next_bump.timestamp())}:R>",
            inline=False
        )
        
        await interaction.followup.send(embed=success_embed)
        
    except Exception as error:
        print(f'Database error in bump: {error}')
        await interaction.followup.send('❌ Database error occurred. Please try again later.')


@bot.tree.command(name='preview', description='Preview the bump ad for your server')
async def preview_command(interaction: discord.Interaction):
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        # Check if server exists in database first
        servers = db['servers']
        server_in_db = servers.find_one({'guildId': str(interaction.guild.id)})
        
        if not server_in_db:
            domain = await bot.get_domain_for_guild(str(interaction.guild.id))
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server is not listed on the website yet.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    f"• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    f"• **Add your server**: [Visit here](https://www.{domain}/add-server)\n"
                    f"• **Need help?** Use `/help` for more information"
                ),
                inline=False
            )
            embed.add_field(
                name="⚡ Quick Setup Steps:",
                value=(
                    "1. **Add server** to website\n"
                    "2. **Wait for approval** (if required)\n"
                    "3. **Use `/setup`** to configure cross-advertising"
                ),
                inline=False
            )
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        this_server = servers.find_one({
            'guildId': str(interaction.guild.id),
            'crossAdEnabled': True,
            'crossAdChannelId': {'$exists': True}
        })
        
        if not this_server:
            # Check if it's a configuration issue vs server not being listed
            if server_in_db.get('crossAdEnabled') is False or not server_in_db.get('crossAdChannelId'):
                await interaction.response.send_message(
                    '❌ **Cross-Advertising Not Configured**\n\n'
                    'Your server is listed on the website but cross-advertising is not set up yet.\n\n'
                    '**To configure cross-advertising:**\n'
                    '1. **Set ad channel**: Use `/setadchannel #channel`\n'
                    '2. **Enable cross-advertising**: Use `/enablecrossad True`\n'
                    '3. **Return here** and run `/preview` again\n\n'
                    'Need help? Use `/setup` for a guided setup process.',
                    ephemeral=True
                )
            else:
                await interaction.response.send_message(
                    'Cross-advertising is not enabled or ad channel not set for this server.',
                    ephemeral=True
                )
            return
        
        embed, view = await bot.build_ad_embed(this_server, interaction.guild)
        
        if view:
            await interaction.response.send_message(embed=embed, view=view, ephemeral=True)
        else:
            await interaction.response.send_message(embed=embed, ephemeral=True)
            
    except Exception as error:
        print(f'Database error in preview: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )



@bot.tree.command(name='toggle_bot_reminders', description='Enable/disable bot bump reminders for yourself')
async def toggle_bot_reminders(interaction: discord.Interaction):
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        user_settings = db['user_settings']
        current_setting = user_settings.find_one({'userId': str(interaction.user.id)})
        
        # Toggle the setting
        new_setting = not (current_setting and current_setting.get('botRemindersEnabled', False))
        
        user_settings.update_one(
            {'userId': str(interaction.user.id)},
            {'$set': {'botRemindersEnabled': new_setting}},
            upsert=True
        )
        
        embed = discord.Embed(
            title="🔔 Bot Reminders",
            description=f"Bot bump reminders are now **{'enabled' if new_setting else 'disabled'}**",
            color=0x00ff00 if new_setting else 0xff0000,
            timestamp=datetime.utcnow()
        )
        
        if new_setting:
            embed.add_field(
                name="What happens now?",
                value="You'll receive a DM when you can use `/bump` again (2 hours after your last bump)",
                inline=False
            )
        else:
            embed.add_field(
                name="What happens now?",
                value="You won't receive DMs about bot bump availability",
                inline=False
            )
        
        await interaction.response.send_message(embed=embed, ephemeral=True)
        
    except Exception as error:
        print(f'Database error in toggle_bot_reminders: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


@bot.tree.command(name='checkperms', description='Check bot permissions for cross-advertising (Admin only)')
async def check_perms_command(interaction: discord.Interaction):
    # Check permissions first, before any interaction response
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            'You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    # Defer immediately after permission check
    await interaction.response.defer(ephemeral=True)
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.followup.send('Database temporarily unavailable. Please try again later.')
            return
        
        # Check if server is listed on the website using cached lookup
        server_doc = await bot.get_server_data_cached(str(interaction.guild.id))
        if not server_doc:
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server must be listed on our website before you can configure cross-advertising.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    "• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    "• **Not listed yet?** Add your server at:\n"
                    "  - https://hentaidiscord.com/add-server\n"
                    "  - https://animediscord.com/add-server"
                ),
                inline=False
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Check cross-advertising status
        cross_ad_enabled = server_doc.get('crossAdEnabled', False)
        cross_ad_channel_id = server_doc.get('crossAdChannelId')
        disabled_reason = server_doc.get('crossAdDisabledReason')
        disabled_at = server_doc.get('crossAdDisabledAt')
        
        embed = discord.Embed(
            title="🔍 Cross-Advertising Status",
            color=0x00ff00 if cross_ad_enabled else 0xff0000,
            timestamp=datetime.utcnow()
        )
        
        # Status
        status_text = "✅ Enabled" if cross_ad_enabled else "❌ Disabled"
        if disabled_reason:
            status_text += f"\n**Reason**: {disabled_reason}"
        if disabled_at:
            status_text += f"\n**Disabled At**: {disabled_at.strftime('%Y-%m-%d %H:%M:%S UTC')}"
        
        embed.add_field(name="📊 Status", value=status_text, inline=False)
        
        # Channel check
        if cross_ad_channel_id:
            try:
                channel = bot.get_channel(int(cross_ad_channel_id))
                if channel:
                    has_perms, perm_reason = await bot.check_channel_permissions(int(cross_ad_channel_id))
                    channel_status = f"<#{cross_ad_channel_id}>\n"
                    if has_perms:
                        channel_status += "✅ Bot has required permissions"
                    else:
                        channel_status += f"❌ {perm_reason}"
                else:
                    channel_status = f"Channel ID: {cross_ad_channel_id}\n❌ Channel not found"
                
                embed.add_field(name="📺 Ad Channel", value=channel_status, inline=False)
            except Exception as e:
                embed.add_field(name="📺 Ad Channel", value=f"Error checking channel: {str(e)[:100]}...", inline=False)
        else:
            embed.add_field(name="📺 Ad Channel", value="❌ No channel set", inline=False)
        
        # Add instructions
        if not cross_ad_enabled or disabled_reason:
            embed.add_field(
                name="🛠️ How to fix:",
                value=(
                    "• Set a channel: `/setadchannel #your-channel`\n"
                    "• Enable cross-advertising: `/enablecrossad enabled:True`\n"
                    "• Make sure bot has 'Send Messages' and 'Embed Links' permissions"
                ),
                inline=False
            )
        
        await interaction.followup.send(embed=embed)
        
    except Exception as error:
        print(f'Error in checkperms: {error}')
        await interaction.followup.send('An error occurred while checking permissions.')


@bot.tree.command(name='validatechannel', description='Test your cross-advertising channel setup (Admin only)')
async def validate_channel_command(interaction: discord.Interaction):
    # Check permissions first, before any interaction response
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            'You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    # Defer immediately after permission check
    await interaction.response.defer(ephemeral=True)
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.followup.send('Database temporarily unavailable. Please try again later.')
            return
        
        # Check if server is listed on the website
        server_doc = await bot.get_server_data_cached(str(interaction.guild.id))
        if not server_doc:
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server must be listed on our website before validating cross-advertising setup.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            await interaction.followup.send(embed=embed)
            return
        
        cross_ad_enabled = server_doc.get('crossAdEnabled', False)
        cross_ad_channel_id = server_doc.get('crossAdChannelId')
        
        embed = discord.Embed(
            title="🔍 Channel Validation Results",
            color=0x5865F2,
            timestamp=datetime.utcnow()
        )
        
        # Test 1: Check if cross-advertising is enabled
        if not cross_ad_enabled:
            embed.add_field(
                name="❌ Test 1: Cross-Advertising Status",
                value="Cross-advertising is disabled for this server.\nUse `/enablecrossad True` to enable it.",
                inline=False
            )
        else:
            embed.add_field(
                name="✅ Test 1: Cross-Advertising Status",
                value="Cross-advertising is enabled.",
                inline=False
            )
        
        # Test 2: Check if channel is set
        if not cross_ad_channel_id:
            embed.add_field(
                name="❌ Test 2: Channel Configuration",
                value="No cross-advertising channel is set.\nUse `/setadchannel #your-channel` to set one.",
                inline=False
            )
        else:
            # Test 3: Check channel permissions
            has_perms, perm_reason = await bot.check_channel_permissions(cross_ad_channel_id)
            if has_perms:
                embed.add_field(
                    name="✅ Test 2: Channel Configuration",
                    value=f"Channel: <#{cross_ad_channel_id}>",
                    inline=False
                )
                embed.add_field(
                    name="✅ Test 3: Bot Permissions",
                    value="Bot has all required permissions in the channel.",
                    inline=False
                )
                
                # Test 4: Send a test message
                try:
                    test_channel = bot.get_channel(int(cross_ad_channel_id))
                    if test_channel:
                        test_embed = discord.Embed(
                            title="✅ Test Message",
                            description="This is a test message to verify cross-advertising functionality.",
                            color=0x00ff00
                        )
                        await test_channel.send(embed=test_embed, delete_after=10)
                        embed.add_field(
                            name="✅ Test 4: Message Sending",
                            value="Successfully sent test message to channel.\n*(Message will auto-delete in 10 seconds)*",
                            inline=False
                        )
                    else:
                        embed.add_field(
                            name="❌ Test 4: Message Sending",
                            value="Could not access the channel.",
                            inline=False
                        )
                except Exception as e:
                    embed.add_field(
                        name="❌ Test 4: Message Sending",
                        value=f"Failed to send test message: {str(e)[:100]}...",
                        inline=False
                    )
            else:
                embed.add_field(
                    name="❌ Test 2: Channel Configuration",
                    value=f"Channel ID: {cross_ad_channel_id}",
                    inline=False
                )
                embed.add_field(
                    name="❌ Test 3: Bot Permissions",
                    value=f"Permission issue: {perm_reason}",
                    inline=False
                )
        
        # Add overall status
        all_tests_passed = (cross_ad_enabled and cross_ad_channel_id and 
                           cross_ad_channel_id and has_perms if 'has_perms' in locals() else False)
        
        if all_tests_passed:
            embed.color = 0x00ff00
            embed.add_field(
                name="🎉 Overall Status",
                value="✅ Your cross-advertising setup is working correctly!\nYou can send ads via `/bump` and receive ads from other servers.",
                inline=False
            )
            embed.add_field(
                name="🤝 Fairness Principle",
                value="Cross-advertising works both ways - you can send ads because you can also receive them. This ensures fair participation for all servers in the network.",
                inline=False
            )
        else:
            embed.color = 0xff0000
            embed.add_field(
                name="⚠️ Overall Status",
                value="❌ Issues found with your cross-advertising setup.\nPlease fix the issues above and run this command again.",
                inline=False
            )
            embed.add_field(
                name="🚫 Impact",
                value="Until these issues are fixed, you cannot use `/bump` to send ads to other servers. Cross-advertising requires that you can both send AND receive ads.",
                inline=False
            )
        
        await interaction.followup.send(embed=embed)
        
    except Exception as error:
        print(f'Error in validatechannel: {error}')
        await interaction.followup.send('An error occurred while validating your channel setup.')


@bot.tree.command(name='info', description='Show server statistics and cross-advertising info')
async def info_command(interaction: discord.Interaction):
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        servers = db['servers']
        bot_bumps = db['bot_bumps']
        
        # Get this server's info
        this_server = servers.find_one({'guildId': str(interaction.guild.id)})
        
        # Check if server is not listed on website
        if not this_server:
            domain = await bot.get_domain_for_guild(str(interaction.guild.id))
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description="Your server is not listed on the website yet.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 What to do:",
                value=(
                    f"• **Just added your server?** Wait ~5 minutes or use `/refresh`\n"
                    f"• **Add your server**: [Visit here](https://www.{domain}/add-server)\n"
                    f"• **Need help?** Use `/help` for more information"
                ),
                inline=False
            )
            embed.add_field(
                name="⚡ Quick Setup Steps:",
                value=(
                    "1. **Add server** to website\n"
                    "2. **Wait for approval** (if required)\n"
                    "3. **Use `/setup`** to configure cross-advertising"
                ),
                inline=False
            )
            
            # Still show network stats
            total_servers = servers.count_documents({'crossAdEnabled': True})
            total_bumps = bot_bumps.count_documents({})
            
            embed.add_field(
                name="🌍 Network Stats",
                value=f"**Active Servers:** {total_servers}\n**Total Bumps:** {total_bumps}",
                inline=False
            )
            
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        # Get total info
        total_servers = servers.count_documents({'crossAdEnabled': True})
        total_bumps = bot_bumps.count_documents({})
        server_bumps = bot_bumps.count_documents({'guildId': str(interaction.guild.id)})
        
        # Get last bump info
        last_bump = bot_bumps.find_one(
            {'guildId': str(interaction.guild.id)},
            sort=[('bumpedAt', -1)]
        )
        
        embed = discord.Embed(
            title="📊 Server Statistics",
            color=0x5865F2,
            timestamp=datetime.utcnow()
        )
        
        # Server status
        if this_server and this_server.get('crossAdEnabled'):
            embed.add_field(
                name="✅ Cross-Advertising Status",
                value="Enabled",
                inline=True
            )
            if this_server.get('crossAdChannelId'):
                channel = await bot.fetch_channel(int(this_server['crossAdChannelId']))
                embed.add_field(
                    name="📺 Ad Channel",
                    value=channel.mention if channel else "Channel not found",
                    inline=True
                )
        else:
            embed.add_field(
                name="❌ Cross-Advertising Status",
                value="Disabled",
                inline=True
            )
        
        # Domain info
        domain = await bot.get_domain_for_guild(str(interaction.guild.id))
        embed.add_field(
            name="🌐 Domain",
            value=domain,
            inline=True
        )
        
        # Bump info
        embed.add_field(
            name="🚀 Your Server Bumps",
            value=f"{server_bumps} total",
            inline=True
        )
        
        embed.add_field(
            name="🌍 Network Servers",
            value=f"{total_servers} active",
            inline=True
        )
        
        embed.add_field(
            name="📈 Total Network Bumps",
            value=f"{total_bumps} bumps",
            inline=True
        )
        
        # Last bump info
        if last_bump:
            embed.add_field(
                name="⏰ Last Bump",
                value=f"<t:{int(last_bump['bumpedAt'].timestamp())}:R>",
                inline=False
            )
        
        embed.set_footer(text=f"Server ID: {interaction.guild.id}")
        
        await interaction.response.send_message(embed=embed, ephemeral=True)
        
    except Exception as error:
        print(f'Database error in info: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


@bot.tree.command(name='setup', description='Interactive setup guide for cross-advertising (Admin only)')
async def setup_command(interaction: discord.Interaction):
    # Check permissions
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            '❌ You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        servers = db['servers']
        current_server = servers.find_one({'guildId': str(interaction.guild.id)})
        
        # Check if server is not listed on website
        if not current_server:
            domain = await bot.get_domain_for_guild(str(interaction.guild.id))
            embed = discord.Embed(
                title="❌ Server Not Listed",
                description=f"**{interaction.guild.name}** is not listed on the website yet.",
                color=0xff0000,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="📋 Before Setting Up Cross-Advertising",
                value=(
                    f"Your server must be listed on the website first.\n\n"
                    f"**Steps to get started:**\n"
                    f"1. **Add your server**: [Visit here](https://www.{domain}/add-server)\n"
                    f"2. **Fill out the form** with your server details\n"
                    f"3. **Wait for approval** (if required)\n"
                    f"4. **Return here** and run `/setup` again"
                ),
                inline=False
            )
            embed.add_field(
                name="❓ Need Help?",
                value=f"Visit [our website](https://www.{domain}) or join our [Support Server](https://discord.gg/v6wVhvEGmG) for assistance\n\nWant to invite this bot to other servers? Use `/invite`",
                inline=False
            )
            embed.set_footer(text="Cross-advertising requires website registration")
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        # Setup progress embed
        embed = discord.Embed(
            title="🛠️ Cross-Advertising Setup",
            description=f"Let's set up cross-advertising for **{interaction.guild.name}**!",
            color=0x5865F2,
            timestamp=datetime.utcnow()
        )
        
        # Check current status
        has_channel = current_server and current_server.get('crossAdChannelId')
        is_enabled = current_server and current_server.get('crossAdEnabled', False)
        
        # Step 1: Channel Setup
        if has_channel:
            try:
                channel = await bot.fetch_channel(int(current_server['crossAdChannelId']))
                embed.add_field(
                    name="✅ Step 1: Ad Channel",
                    value=f"Currently set to {channel.mention}",
                    inline=False
                )
            except:
                embed.add_field(
                    name="⚠️ Step 1: Ad Channel",
                    value="Channel not found - needs to be set again",
                    inline=False
                )
                has_channel = False
        else:
            embed.add_field(
                name="❌ Step 1: Ad Channel",
                value="Use `/setadchannel #channel` to set where ads will be posted",
                inline=False
            )
        
        # Step 2: Enable Cross-Advertising
        if is_enabled:
            embed.add_field(
                name="✅ Step 2: Cross-Advertising",
                value="Cross-advertising is enabled",
                inline=False
            )
        else:
            embed.add_field(
                name="❌ Step 2: Cross-Advertising",
                value="Use `/enablecrossad True` to enable cross-advertising",
                inline=False
            )
        
        # Step 3: Domain Preference (Optional)
        domain = await bot.get_domain_for_guild(str(interaction.guild.id))
        domain_pref = current_server.get('domainPreference') if current_server else None
        if domain_pref:
            domain_name = 'HentaiDiscord.com' if domain_pref == 'hentai' else 'AnimeDiscord.com'
            embed.add_field(
                name="✅ Step 3: Domain Preference",
                value=f"Set to {domain_name}",
                inline=False
            )
        else:
            embed.add_field(
                name="⭐ Step 3: Domain Preference (Optional)",
                value=f"Currently: Auto ({domain})\nUse `/domain` to set a specific domain",
                inline=False
            )
        
        # Setup status
        if has_channel and is_enabled:
            embed.add_field(
                name="🎉 Setup Complete!",
                value=(
                    "Your server is ready for cross-advertising!\n"
                    "• Users can now use `/bump` every 2 hours\n"
                    "• Your server will receive ads from other servers\n"
                    "• Use `/info` to view statistics"
                ),
                inline=False
            )
            embed.color = 0x00ff00
        else:
            missing_steps = []
            if not has_channel:
                missing_steps.append("Set ad channel")
            if not is_enabled:
                missing_steps.append("Enable cross-advertising")
            
            embed.add_field(
                name="⚠️ Setup Incomplete",
                value=f"Still needed: {', '.join(missing_steps)}",
                inline=False
            )
            embed.color = 0xff9900
        
        # Additional info
        embed.add_field(
            name="📚 Additional Commands",
            value=(
                "• `/serverinfo` - View server details\n"
                "• `/help` - Full command list\n"
                "• `/preview` - Preview your server's ad"
            ),
            inline=False
        )
        
        embed.set_footer(text="Need help? Use /help or join our support server")
        
        await interaction.response.send_message(embed=embed, ephemeral=True)
        
    except Exception as error:
        print(f'Database error in setup: {error}')
        await interaction.response.send_message(
            'Database error occurred. Please try again later.',
            ephemeral=True
        )


# @bot.tree.command(name='websitestats', description='View website statistics and network information')
# async def websitestats_command(interaction: discord.Interaction):
#     """Commented out - not needed for current implementation"""
#     pass


@bot.tree.command(name='serverinfo', description='View detailed information about this server (Admin only)')
async def serverinfo_command(interaction: discord.Interaction):
    # Check permissions
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message(
            '❌ You must be a server administrator to use this command.',
            ephemeral=True
        )
        return
    
    try:
        db = await bot.safe_connect_mongo()
        if db is None:
            await interaction.response.send_message(
                'Database temporarily unavailable. Please try again later.',
                ephemeral=True
            )
            return
        
        await interaction.response.defer(ephemeral=True)
        
        # Only show info for current server
        target_guild_id = str(interaction.guild.id)
        
        servers = db['servers']
        bot_bumps = db['bot_bumps']
        
        # Get server data from database
        server_data = servers.find_one({'guildId': target_guild_id})
        
        # Get Discord guild info (we know it exists since we're in it)
        guild = interaction.guild
        
        # Create embed
        embed = discord.Embed(
            title=f"🏠 Server Information: {guild.name}",
            color=0x5865F2,
            timestamp=datetime.utcnow()
        )
        
        # Basic Discord info
        if guild.icon:
            embed.set_thumbnail(url=guild.icon.url)
        
        embed.add_field(
            name="📊 Discord Info",
            value=(
                f"**Name:** {guild.name}\n"
                f"**Members:** {guild.member_count:,}\n"
                f"**Created:** <t:{int(guild.created_at.timestamp())}:D>\n"
                f"**Boost Level:** {guild.premium_tier}/3"
            ),
            inline=True
        )
        
        # Website/Database info
        if server_data:
            cross_ad_status = "✅ Enabled" if server_data.get('crossAdEnabled') else "❌ Disabled"
            domain_pref = server_data.get('domainPreference', 'Auto')
            
            website_info = (
                f"**Cross-Advertising:** {cross_ad_status}\n"
                f"**Domain Preference:** {domain_pref.title()}\n"
            )
            
            if server_data.get('crossAdChannelId'):
                try:
                    ad_channel = await bot.fetch_channel(int(server_data['crossAdChannelId']))
                    if ad_channel:
                        website_info += f"**Ad Channel:** {ad_channel.mention}\n"
                    else:
                        website_info += f"**Ad Channel:** Channel not found\n"
                except:
                    website_info += f"**Ad Channel:** Channel not found\n"
            else:
                website_info += f"**Ad Channel:** Not set\n"
            
            # Website-specific data
            if server_data.get('language'):
                website_info += f"**Language:** {server_data['language']}\n"
            if server_data.get('categories'):
                website_info += f"**Categories:** {', '.join(server_data['categories'])}\n"
            if server_data.get('averageRating'):
                website_info += f"**Rating:** {server_data['averageRating']} ⭐\n"
            
            embed.add_field(
                name="🌐 Website Info",
                value=website_info,
                inline=True
            )
        else:
            embed.add_field(
                name="🌐 Website Info",
                value="**Cross-Advertising:** ❌ Not configured\n**Status:** Not in database",
                inline=True
            )
        
        # Bump statistics
        total_bumps = bot_bumps.count_documents({'guildId': target_guild_id})
        last_bump = bot_bumps.find_one(
            {'guildId': target_guild_id},
            sort=[('bumpedAt', -1)]
        )
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_bumps = bot_bumps.count_documents({
            'guildId': target_guild_id,
            'bumpedAt': {'$gte': thirty_days_ago}
        })
        
        bump_stats = f"**Total Bumps:** {total_bumps}\n**Recent Bumps (30d):** {recent_bumps}\n"
        if last_bump:
            bump_stats += f"**Last Bump:** <t:{int(last_bump['bumpedAt'].timestamp())}:R>\n"
        else:
            bump_stats += "**Last Bump:** Never\n"
        
        # Activity level
        if recent_bumps >= 30:
            activity_level = "🔥 Very Active"
        elif recent_bumps >= 15:
            activity_level = "🟢 Active"
        elif recent_bumps >= 5:
            activity_level = "🟡 Moderate"
        elif recent_bumps > 0:
            activity_level = "🟠 Low"
        else:
            activity_level = "⚪ Inactive"
        
        bump_stats += f"**Activity Level:** {activity_level}"
        
        embed.add_field(
            name="📈 Bump Statistics",
            value=bump_stats,
            inline=False
        )
        
        # Website links
        if server_data:
            domain = await bot.get_domain_for_guild(target_guild_id)
            
            # Generate bot invite link
            bot_id = bot.user.id if bot.user else "YOUR_BOT_ID"
            permissions = 277025508416  # Send Messages, Use Slash Commands, Embed Links, Read Message History, View Channels
            invite_link = f"https://discord.com/api/oauth2/authorize?client_id={bot_id}&permissions={permissions}&scope=bot%20applications.commands"
            
            embed.add_field(
                name="🔗 Links",
                value=(
                    f"[Server Page](https://www.{domain}/server/{target_guild_id})\n"
                    f"[Website Home](https://www.{domain})\n"
                    f"[Support Server](https://discord.gg/v6wVhvEGmG)\n"
                    f"[Invite Bot]({invite_link})"
                ),
                inline=True
            )
        else:
            domain = await bot.get_domain_for_guild(target_guild_id)
            
            # Generate bot invite link
            bot_id = bot.user.id if bot.user else "YOUR_BOT_ID"
            permissions = 277025508416  # Send Messages, Use Slash Commands, Embed Links, Read Message History, View Channels
            invite_link = f"https://discord.com/api/oauth2/authorize?client_id={bot_id}&permissions={permissions}&scope=bot%20applications.commands"
            
            embed.add_field(
                name="🔗 Links",
                value=(
                    f"[Add Server](https://www.{domain}/add-server)\n"
                    f"[Website Home](https://www.{domain})\n"
                    f"[Support Server](https://discord.gg/v6wVhvEGmG)\n"
                    f"[Invite Bot]({invite_link})"
                ),
                inline=True
            )
        
        # Quick actions
        embed.add_field(
            name="⚡ Quick Actions",
            value=(
                "• Use `/setup` to configure cross-advertising\n"
                "• Use `/bump` to advertise your server\n"
                "• Use `/preview` to see your ad"
            ),
            inline=False
        )
        
        embed.set_footer(text=f"Server ID: {target_guild_id}")
        
        await interaction.followup.send(embed=embed)
        
    except Exception as error:
        print(f'Database error in serverinfo: {error}')
        if not interaction.response.is_done():
            await interaction.response.send_message(
                'Database error occurred. Please try again later.',
                ephemeral=True
            )
        else:
            await interaction.followup.send(
                'Database error occurred. Please try again later.'
            )


# Network/Discovery command - commented out (not needed)
# @bot.tree.command(name='network', description='Discover and explore servers in the network')
# async def network_command(interaction: discord.Interaction):
#     """Commented out - not needed for current implementation"""
#     pass


# Help command
@bot.tree.command(name='help', description='Show all available commands and how to use them')
async def help_command(interaction: discord.Interaction):
    """Show comprehensive help information"""
    
    # Rate limiting
    if bot.is_rate_limited(interaction.user.id, 'help', 10):
        await interaction.response.send_message(
            "⏱️ Please wait a moment before using this command again.",
            ephemeral=True
        )
        return
    
    embed = discord.Embed(
        title="🤖 Bot Help",
        description="Welcome to the cross-advertising bot! Here's what you can do:",
        color=0x5865F2,
        timestamp=datetime.utcnow()
    )
    
    # Admin commands
    embed.add_field(
        name="👑 Admin Commands",
        value=(
            "`/setup` - Interactive setup guide\n"
            "`/setadchannel` - Set the channel for receiving ads\n"
            "`/enablecrossad` - Enable/disable cross-advertising\n"
            "`/validatechannel` - Test your channel setup\n"
            "`/checkperms` - Check bot permissions\n"
            "`/domain` - Check or set domain preference\n"
            "`/serverinfo` - View detailed server information"
        ),
        inline=False
    )
    
    # User commands
    embed.add_field(
        name="👤 User Commands",
        value=(
            "`/bump` - Send your server ad to other servers\n"
            "`/preview` - Preview your server's ad\n"
            "`/toggle_bot_reminders` - Toggle bump reminder DMs\n"
            "`/info` - View server information\n"
            "`/invite` - Get bot invite link\n"
            "`/refresh` - Refresh cache (if you just added your server)"
        ),
        inline=False
    )
    
    # Important info
    embed.add_field(
        name="⚠️ Important Info",
        value=(
            "• Bump cooldown: **2 hours**\n"
            "• Cross-advertising must be enabled\n"
            "• Ad channel must be set by admin\n"
            "• **Fairness principle**: You can only send ads if you can receive them\n"
            "• Website bumps have separate reminders"
        ),
        inline=False
    )
    
    # Links
    domain = bot.get_domain_for_guild_sync(str(interaction.guild.id) if interaction.guild else None)
    
    embed.add_field(
        name="🔗 Links",
        value=f"[Website](https://www.{domain}) • [Add Server](https://www.{domain}/add-server) • [Support Server](https://discord.gg/v6wVhvEGmG) • [Invite Bot]({bot.get_bot_invite_link()})",
        inline=False
    )
    
    embed.set_footer(text="Need help? Join our support server or visit the website")
    
    await interaction.response.send_message(embed=embed, ephemeral=True)


@bot.tree.command(name='invite', description='Get the bot invite link to add this bot to other servers')
async def invite_command(interaction: discord.Interaction):
    """Generate and display bot invite link"""
    
    # Rate limiting
    if bot.is_rate_limited(interaction.user.id, 'invite', 10):
        await interaction.response.send_message(
            "⏱️ Please wait a moment before using this command again.",
            ephemeral=True
        )
        return
    
    embed = discord.Embed(
        title="🤖 Invite Bot to Your Server",
        description="Add this cross-advertising bot to other Discord servers!",
        color=0x5865F2,
        timestamp=datetime.utcnow()
    )
    
    embed.add_field(
        name="📋 Required Permissions",
        value=(
            "• **Send Messages** - Post cross-advertising messages\n"
            "• **Use Slash Commands** - Bot commands functionality\n"
            "• **Embed Links** - Rich embed advertisements\n"
            "• **Read Message History** - Channel verification\n"
            "• **View Channels** - Access designated ad channels"
        ),
        inline=False
    )
    
    embed.add_field(
        name="🔗 Invite Link",
        value=f"[Click here to invite the bot]({bot.get_bot_invite_link()})",
        inline=False
    )
    
    embed.add_field(
        name="📚 Getting Started",
        value=(
            "1. **Invite the bot** using the link above\n"
            "2. **List your server** on our website\n"
            "3. **Run `/setup`** to configure cross-advertising\n"
            "4. **Start bumping** with `/bump` every 2 hours!"
        ),
        inline=False
    )
    
    # Get domain for links
    domain = bot.get_domain_for_guild_sync(str(interaction.guild.id) if interaction.guild else None)
    
    embed.add_field(
        name="🌐 Additional Links",
        value=(
            f"[Website](https://www.{domain}) • "
            f"[Add Server](https://www.{domain}/add-server) • "
            f"[Support Server](https://discord.gg/v6wVhvEGmG)"
        ),
        inline=False
    )
    
    embed.set_footer(text="Share this invite link with other server owners!")
    
    await interaction.response.send_message(embed=embed, ephemeral=True)


@bot.tree.command(name='refresh', description='Refresh server data cache (use if you just added your server to the website)')
async def refresh_command(interaction: discord.Interaction):
    """Manually refresh server cache for immediate recognition of newly added servers"""
    
    # Rate limiting
    if bot.is_rate_limited(interaction.user.id, 'refresh', 10):
        await interaction.response.send_message(
            "⏱️ Please wait a moment before using this command again.",
            ephemeral=True
        )
        return
    
    # Clear cache for this server
    guild_id = str(interaction.guild.id)
    bot.invalidate_server_cache(guild_id)
    
    # Also clear domain cache for this server
    cache_key = f"domain_{guild_id}"
    if cache_key in bot.domain_cache:
        del bot.domain_cache[cache_key]
    
    # Try to fetch fresh data from database
    try:
        server_data = await bot.get_server_data_cached(guild_id)
        
        if server_data:
            embed = discord.Embed(
                title="✅ Cache Refreshed Successfully!",
                description=f"**{interaction.guild.name}** is now recognized in the database.",
                color=0x00ff00,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="✨ What's Next?",
                value=(
                    "Your server is now ready for cross-advertising setup!\n\n"
                    "**Next Steps:**\n"
                    "1. Use `/setup` for guided configuration\n"
                    "2. Or manually use `/setadchannel` and `/enablecrossad`"
                ),
                inline=False
            )
        else:
            domain = await bot.get_domain_for_guild(guild_id)
            embed = discord.Embed(
                title="⚠️ Server Still Not Found",
                description="Your server is still not found in the database after refreshing the cache.",
                color=0xff9900,
                timestamp=datetime.utcnow()
            )
            embed.add_field(
                name="🔍 Possible Issues:",
                value=(
                    "• Server may still be pending approval\n"
                    "• Database sync may take a few more minutes\n"
                    "• Server may not have been submitted yet"
                ),
                inline=False
            )
            embed.add_field(
                name="💡 What to do:",
                value=(
                    f"1. **Double-check**: [Visit your server page](https://www.{domain}/server/{guild_id})\n"
                    f"2. **Add server**: [Submit here](https://www.{domain}/add-server) if not listed\n"
                    f"3. **Wait**: Try `/refresh` again in a few minutes"
                ),
                inline=False
            )
        
        await interaction.response.send_message(embed=embed, ephemeral=True)
        
    except Exception as error:
        print(f'Database error in refresh: {error}')
        await interaction.response.send_message(
            'Database error occurred while refreshing cache. Please try again later.',
            ephemeral=True
        )


# Error handling
@bot.event
async def on_error(event, *args, **kwargs):
    print(f'Error in {event}:')
    print(f'Args: {args}')
    print(f'Kwargs: {kwargs}')
    print('Traceback:')
    traceback.print_exc()


# Additional error handling for command tree
@bot.tree.error
async def on_app_command_error(interaction: discord.Interaction, error: discord.app_commands.AppCommandError):
    # Just log the error - don't try to respond to avoid conflicts
    print(f'App command error in {interaction.command.name if interaction.command else "unknown"}: {error}')
    traceback.print_exc()


# Run the bot
if __name__ == '__main__':
    # Check for required environment variables
    discord_token = os.getenv('DISCORD_BOT_TOKEN')
    if not discord_token:
        print('ERROR: DISCORD_BOT_TOKEN environment variable not found!')
        print('Please set your Discord bot token in the .env.local file')
        exit(1)
    
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print('ERROR: MONGODB_URI environment variable not found!')
        print('Please set your MongoDB connection string in the .env.local file')
        exit(1)
    
    try:
        print('Starting Discord bot...')
        bot.run(discord_token)
    except KeyboardInterrupt:
        print('\nReceived interrupt signal, shutting down gracefully...')
    except Exception as error:
        print(f'Failed to start bot: {error}')
        traceback.print_exc()
    finally:
        # Cleanup
        if bot.mongo_client:
            print('Closing MongoDB connection...')
            bot.mongo_client.close()
        print('Bot shutdown complete.')
