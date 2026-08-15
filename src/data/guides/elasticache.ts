import { ServiceGuide } from "../../types/guide";

export const elasticacheGuide: ServiceGuide = {
  id: "amazon-elasticache",
  service: "Amazon ElastiCache",
  domain: "development",
  tagline: "Managed in-memory caching for sub-millisecond performance",
  intro:
    "ElastiCache is a fully managed in-memory caching service supporting Redis and Memcached. It reduces database load, accelerates read-heavy workloads, and enables sub-millisecond response times for session management, leaderboards, real-time analytics, and caching of expensive database query results.",

  sections: [
    {
      heading: "Redis vs Memcached",
      body: `**Redis (ElastiCache for Redis)**:
- Rich data structures: strings, hashes, lists, sets, sorted sets, bitmaps, HyperLogLog, geospatial indexes
- Persistence: optional RDB snapshots and AOF (append-only file)
- Replication: primary + read replicas (up to 5 per shard)
- Multi-AZ automatic failover
- Cluster mode: partition data across multiple shards (horizontal scaling)
- Pub/Sub messaging
- Lua scripting
- Transactions (MULTI/EXEC)
- Sorted sets: ideal for leaderboards, rate limiting
- **Use for**: caching, sessions, leaderboards, pub/sub, geospatial, queues

**Memcached**:
- Simple key-value store only (string → blob)
- No persistence, no replication, no failover
- Multi-threaded: better CPU utilization per node
- Auto-discovery: clients discover nodes automatically
- Simpler; scales horizontally by adding nodes
- **Use for**: simple object caching where you don't need persistence or replication

**Decision guide**:
- Need replication / HA → Redis
- Need persistence → Redis
- Need complex data types → Redis
- Need pub/sub → Redis
- Need simple multi-threaded caching → Memcached
- Exam: when in doubt → Redis`,
    },
    {
      heading: "Redis Cluster Mode",
      body: `**Cluster Mode Disabled** (classic replication):
- Single shard (one primary + up to 5 read replicas)
- All data on one primary; replicas are read-only copies
- Vertical scaling only (change node type)
- Good for: datasets that fit in one node, simple HA

**Cluster Mode Enabled**:
- Multiple shards, each with their own primary + replicas
- Data partitioned (sharded) across nodes by key slot (0–16383 hash slots)
- Scale horizontally by adding shards
- Scale reads by adding replicas per shard
- Online resharding: add/remove shards without downtime
- **Must use**: Redis Cluster client (not classic Redis client)

**Choosing**:
- Dataset too large for one node → Cluster Mode Enabled
- Need horizontal write scaling → Cluster Mode Enabled
- Simple use case, one node sufficient → Cluster Mode Disabled`,
    },
    {
      heading: "Caching Strategies",
      body: `**Lazy Loading (Cache-Aside)**:
1. Application checks cache for data
2. Cache hit: return cached data
3. Cache miss: fetch from DB, write to cache, return data

Pros: only caches what's requested. Cons: first request always misses (cold start); stale data possible if DB updates without cache invalidation.

**Write-Through**:
1. On every DB write, also write to cache
2. Cache always has current data

Pros: no stale data. Cons: writes are slower (two writes: DB + cache); caches data that may never be read.

**Write-Behind (Write-Back)**:
- Write to cache first, async flush to DB later
- Risk: data loss if cache fails before flush

**TTL (Time-To-Live)**:
- Set expiry on cache keys to prevent stale data
- Lazy loading: set TTL so stale data expires automatically
- Too short: frequent cache misses. Too long: stale data.

**Cache Eviction Policies** (Redis):
- \`allkeys-lru\`: evict least recently used keys (good general default)
- \`volatile-lru\`: LRU among keys with TTL set
- \`allkeys-lfu\`: evict least frequently used
- \`noeviction\`: return error when memory full (not for caching)`,
    },
    {
      heading: "Security",
      body: `**Encryption at rest**: ElastiCache for Redis supports encryption at rest (uses KMS). Memcached does not support encryption at rest.

**Encryption in transit**: ElastiCache supports TLS for data in transit (Redis). Enable at cluster creation. Client must use TLS connection.

**Redis AUTH**: password-based authentication for Redis (legacy). Single password required on all connections.

**Redis RBAC (Role-Based Access Control)**: create users with specific commands/keys they can access. Supported in Redis 6+. More granular than AUTH. Assign users to a user group, attach to cluster.

**VPC**: ElastiCache clusters run inside a VPC. Access restricted by VPC security groups. No public internet access by default.

**Security Groups**: control inbound traffic to the cluster port (Redis: 6379, Memcached: 11211). Allow only your application layer security groups.

**Subnet Groups**: define which subnets ElastiCache can use for node placement. Typically private subnets.`,
    },
    {
      heading: "ElastiCache Patterns",
      body: `**Session Store**:
- Store user sessions in Redis instead of server memory
- Stateless application servers — any server can handle any request
- TTL on session keys for automatic expiry
- Enables horizontal scaling of web tier

**Database Query Cache**:
- Cache results of expensive SQL queries
- Key = hash of query + parameters
- Invalidate on writes (delete cache key or use TTL)
- Reduce DB load by 90%+ for read-heavy apps

**Leaderboard (Sorted Sets)**:
- Redis Sorted Set: ZADD/ZRANGE/ZRANK
- Real-time leaderboard for gaming, scoring
- O(log N) for add/update/rank operations

**Rate Limiting**:
- Redis INCR + EXPIRE: increment counter per user per window
- Atomically increment and check against limit
- SETNX + EXPIRE for distributed locks

**Pub/Sub**:
- Producers PUBLISH to channels
- Consumers SUBSCRIBE to channels
- Not durable (messages not stored; subscriber must be connected)
- Use for: real-time notifications, chat, event broadcasting (not reliable delivery)`,
    },
    {
      heading: "ElastiCache with Other Services",
      body: `**ElastiCache + RDS**: cache query results from RDS. On cache miss, query RDS and populate cache. Reduces RDS load and improves response time.

**ElastiCache + Lambda**: Lambda functions connect to ElastiCache inside VPC. Use connection reuse (init outside handler). Redis client connections persist across warm Lambda invocations.

**ElastiCache + ECS/EC2**: web or API containers connect to Redis for session state. Common pattern: ECS tasks (stateless) + ElastiCache (state).

**ElastiCache + DynamoDB**: cache DynamoDB results for hot items. DAX is the managed DynamoDB-specific cache; ElastiCache is general-purpose.

**ElastiCache + Secrets Manager**: store Redis AUTH password or RBAC credentials in Secrets Manager. Rotate without code change.

**ElastiCache + CloudWatch**: metrics: CacheMisses, CacheHits, CurrConnections, Evictions, BytesUsedForCache. Alarm on Evictions (cache too small) or high CacheMisses (low hit rate).`,
    },
  ],

  keyFacts: [
    "Redis: complex data types, persistence, replication, pub/sub, cluster mode",
    "Memcached: simple key-value, multi-threaded, no persistence or replication",
    "Cluster Mode Enabled: shards data horizontally across multiple primaries",
    "Lazy Loading: cache-aside — read from cache, miss → fetch DB → populate cache",
    "Write-Through: write to cache on every DB write — no stale data, extra write cost",
    "TTL: prevents stale data; tune per access pattern",
    "allkeys-lru: recommended eviction policy for general caching",
    "Redis AUTH: password auth; RBAC: user/command-level access control (Redis 6+)",
    "Encryption in transit: TLS; Encryption at rest: KMS (Redis only)",
    "Session store + ElastiCache = stateless app servers enabling horizontal scaling",
  ],

  relatedServices: [
    "Amazon RDS",
    "Amazon DynamoDB",
    "AWS Lambda",
    "Amazon ECS",
    "Amazon EC2",
    "AWS Secrets Manager",
    "Amazon CloudWatch",
    "Amazon VPC",
  ],

  examTips: [
    "Redis for HA/replication/persistence/complex types. Memcached for simple multi-threaded caching.",
    "Cluster Mode Enabled: horizontal scaling (sharding). Cluster Mode Disabled: vertical scaling only.",
    "Lazy loading: only caches what's read — initial misses and potential stale data.",
    "Write-through: no stale data but extra write latency and unused cached data.",
    "Session store in Redis = stateless web tier = horizontal scalability.",
    "Sorted sets (ZADD/ZRANK): ideal for real-time leaderboards.",
    "INCR + EXPIRE: atomic rate limiting per key in Redis.",
    "Evictions metric in CloudWatch: if high, your cache is too small or TTLs too short.",
    "ElastiCache runs inside VPC — security groups restrict access to port 6379.",
  ],
};
