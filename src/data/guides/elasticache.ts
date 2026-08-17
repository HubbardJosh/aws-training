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
      body: `ElastiCache supports two engines with fundamentally different capabilities, and choosing the right one matters significantly for your use case.

**Redis** is the more capable engine. Beyond basic key-value storage, Redis supports rich data structures — strings, hashes, lists, sets, sorted sets, bitmaps, HyperLogLog, and geospatial indexes. Each structure comes with specialized operations: sorted sets support \`ZADD\`, \`ZRANK\`, and \`ZRANGE\` for real-time leaderboards; lists support \`LPUSH\` and \`BRPOP\` for work queues; pub/sub enables message broadcasting. Redis also supports **persistence** through RDB snapshots and AOF (append-only file) logging, which survive restarts. Multi-AZ configurations with a primary node and up to 5 read replicas per shard provide high availability, and cluster mode can horizontally partition data across multiple shards. Redis supports Lua scripting and MULTI/EXEC transactions for atomic operations across multiple keys.

**Memcached** is simpler by design: it's a multi-threaded key-value store with better CPU utilization per node. It has no persistence, no replication, no failover, and no complex data structures — just raw throughput for string-to-blob caching. Memcached scales horizontally by adding nodes, and clients use auto-discovery to find all nodes. Choose Memcached when you need simple, high-throughput object caching and don't require any of Redis's advanced features. In practice, when in doubt, Redis is the better default — it's more capable and the performance overhead is negligible for typical workloads.`,
    },
    {
      heading: "Redis Cluster Mode",
      body: `Redis on ElastiCache comes in two configurations that determine how data is distributed and how you scale.

**Cluster Mode Disabled** (classic replication) uses a single shard: one primary node handles all writes, and up to 5 read replicas hold copies of the data. If the primary fails, ElastiCache promotes a replica automatically. This configuration is straightforward and works well when your entire working set fits in one node. You scale vertically by changing the node type. The standard Redis client works without any special configuration.

**Cluster Mode Enabled** distributes data across multiple shards using consistent hashing. Each shard has its own primary node and optional replicas. The cluster uses 16,384 hash slots divided evenly across shards — each key maps to a slot, and each slot maps to a shard. This enables horizontal write scaling: instead of one primary handling all writes, each shard's primary handles writes for its portion of the key space. You can add shards (online resharding) without downtime, and you can scale reads by adding replicas per shard independently. The requirement is using a Redis Cluster-aware client — the standard Redis client doesn't understand cluster topology. Enable cluster mode when your dataset is too large for a single node or when write throughput exceeds what a single primary can handle.`,
    },
    {
      heading: "Caching Strategies",
      body: `The caching strategy you choose determines the freshness/consistency tradeoff of your cached data.

**Lazy Loading (Cache-Aside)** is the most common pattern. The application checks the cache before querying the database. On a cache hit, the cached value is returned directly without touching the database. On a cache miss, the application queries the database, writes the result to the cache with an appropriate TTL, and returns the value. The advantages are that only requested data is cached (no wasted memory on unread data) and the application still works if the cache is empty or unavailable. The disadvantage is that the first request for any data always incurs a cache miss, and if the database is updated directly (bypassing the cache), the cached data becomes stale until the TTL expires.

**Write-Through** updates the cache every time the database is written. Every write is two writes: one to the database and one to the cache. This keeps the cache always fresh — there's no stale data — but at the cost of extra write latency and the risk of caching data that's never read. Write-through works best for data that's both frequently written and frequently read.

**TTL (Time to Live)** is complementary to both strategies. Setting a TTL on cache keys ensures that stale data expires automatically, providing a safety net against cache-database divergence. The right TTL depends on how often the data changes and how fresh it needs to be. Too short a TTL means frequent cache misses; too long means users see stale data.

**Cache eviction policies** determine what Redis removes when memory is full. \`allkeys-lru\` (evict the least recently used key) is a good general default for caches. \`volatile-lru\` applies LRU eviction only to keys with TTLs set. \`noeviction\` returns an error when memory is full — never appropriate for a cache.`,
    },
    {
      heading: "Security",
      body: `ElastiCache for Redis provides several security mechanisms that should all be used together in production.

**Encryption in transit** secures data between your application and the cache cluster using TLS. Enabling this requires your Redis client to use a TLS-capable connection. **Encryption at rest** encrypts the data stored in Redis (including RDB snapshots and AOF files) using KMS — this is only available for Redis, not Memcached.

For authentication, Redis supports two approaches. **Redis AUTH** is the legacy single-password mechanism: any client that knows the password can connect. **Redis RBAC** (Role-Based Access Control), available in Redis 6+, creates named users with specific permissions for which commands they can execute and which key namespaces they can access. Users are assigned to a user group, and the group is attached to the cluster. RBAC is more granular and auditable than AUTH.

ElastiCache clusters run inside your VPC and are not publicly accessible. **Security groups** control which sources can reach the cluster on the Redis port (6379) or Memcached port (11211). The typical pattern is an application-tier security group that allows inbound connections from your ECS task security group or Lambda — nothing else. **Subnet groups** define which subnets ElastiCache can use for node placement; these should always be private subnets with no public internet route.`,
    },
    {
      heading: "ElastiCache Patterns",
      body: `Several patterns come up repeatedly when designing ElastiCache architectures.

**Session Store** is the most common pattern for web applications. Instead of storing user sessions in memory on each application server (which breaks horizontal scaling — if a user's request goes to a different server, their session is lost), you store sessions in Redis. Every application server reads from and writes to the same Redis cluster, making application servers truly stateless. TTL on session keys provides automatic expiry. This pattern enables horizontal scaling of your web tier without sticky sessions.

**Database Query Cache** stores the results of expensive SQL or NoSQL queries in Redis. The cache key is typically a hash of the query string and parameters. When the underlying data changes, you can either delete the cache key to force a miss on the next request or rely on TTL expiry. A well-tuned query cache can reduce database load by an order of magnitude on read-heavy applications.

**Leaderboards with Sorted Sets** exploit Redis's native sorted set data structure. \`ZADD\` adds or updates a score, \`ZRANK\` retrieves a player's rank, and \`ZRANGE\` with \`WITHSCORES\` retrieves a range of entries with their scores — all in O(log N) time. A global leaderboard that would require expensive SQL \`ORDER BY\` queries becomes a single Redis call.

**Rate Limiting** uses Redis's atomic \`INCR\` command combined with \`EXPIRE\`. Increment a counter keyed by user ID and time window, and compare it to your rate limit threshold. Because \`INCR\` is atomic in Redis, there's no race condition between checking and incrementing the counter.`,
    },
    {
      heading: "ElastiCache with Other Services",
      body: `**ElastiCache + RDS** is the foundational pattern for improving read performance on relational databases. On a cache miss, the application queries RDS and populates the cache. On subsequent reads, the cache serves the result. This pattern can reduce RDS query load dramatically for applications with high read-to-write ratios. When RDS data changes, the cache key must be invalidated to prevent stale reads.

**ElastiCache + Lambda** requires the Lambda function to run inside the same VPC as the ElastiCache cluster, since ElastiCache has no public endpoint. Initialize the Redis connection outside the handler function to reuse it across warm invocations — establishing a new TCP connection on every invocation would add significant latency for short-lived Lambda functions.

**ElastiCache + ECS** follows the same connection reuse principle. Stateless ECS containers connect to Redis for session state, making the application tier horizontally scalable. The ECS task security group needs permission to connect to the ElastiCache security group on port 6379.

For secret management, store Redis AUTH passwords or RBAC user credentials in **Secrets Manager** and fetch them at startup. This enables credential rotation without redeploying your application — the application just needs to handle connection reestablishment when credentials change.`,
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
