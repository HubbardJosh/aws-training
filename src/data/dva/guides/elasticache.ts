import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "Which ElastiCache engine supports persistence through RDB snapshots and AOF logging?",
          options: [
            "Memcached",
            "Redis",
            "Both Redis and Memcached",
            "Neither — ElastiCache is always in-memory only",
          ],
          correctIndex: 1,
          explanation:
            "Redis supports persistence through RDB (snapshot) and AOF (append-only file) logging, allowing data to survive restarts. Memcached has no persistence — all data is lost on restart.",
        },
        {
          question:
            "Which ElastiCache engine is multi-threaded and better for pure high-throughput object caching without advanced features?",
          options: [
            "Redis",
            "Memcached",
            "Both are equally suited for high-throughput caching",
            "Neither — use DynamoDB DAX for high-throughput caching",
          ],
          correctIndex: 1,
          explanation:
            "Memcached is multi-threaded and designed for pure high-throughput key-value caching. It has no persistence, replication, or complex data structures — just raw caching throughput. Choose Memcached when those tradeoffs are acceptable.",
        },
        {
          question:
            "Which Redis data structure and commands are ideal for building a real-time leaderboard?",
          options: [
            "Lists with LPUSH and LRANGE",
            "Sorted sets with ZADD, ZRANK, and ZRANGE",
            "Hashes with HSET and HGETALL",
            "Sets with SADD and SMEMBERS",
          ],
          correctIndex: 1,
          explanation:
            "Redis sorted sets are purpose-built for leaderboards. ZADD adds or updates a score, ZRANK retrieves a member's rank, and ZRANGE retrieves a range of entries with scores — all in O(log N) time.",
        },
      ],
    },
    {
      heading: "Redis Cluster Mode",
      body: `Redis on ElastiCache comes in two configurations that determine how data is distributed and how you scale.

**Cluster Mode Disabled** (classic replication) uses a single shard: one primary node handles all writes, and up to 5 read replicas hold copies of the data. If the primary fails, ElastiCache promotes a replica automatically. This configuration is straightforward and works well when your entire working set fits in one node. You scale vertically by changing the node type. The standard Redis client works without any special configuration.

**Cluster Mode Enabled** distributes data across multiple shards using consistent hashing. Each shard has its own primary node and optional replicas. The cluster uses 16,384 hash slots divided evenly across shards — each key maps to a slot, and each slot maps to a shard. This enables horizontal write scaling: instead of one primary handling all writes, each shard's primary handles writes for its portion of the key space. You can add shards (online resharding) without downtime, and you can scale reads by adding replicas per shard independently. The requirement is using a Redis Cluster-aware client — the standard Redis client doesn't understand cluster topology. Enable cluster mode when your dataset is too large for a single node or when write throughput exceeds what a single primary can handle.`,
      quiz: [
        {
          question:
            "What is the maximum number of read replicas per shard in Redis Cluster Mode Disabled?",
          options: ["1", "3", "5", "15"],
          correctIndex: 2,
          explanation:
            "Redis Cluster Mode Disabled (single shard) supports one primary node and up to 5 read replicas. If the primary fails, ElastiCache automatically promotes a replica.",
        },
        {
          question:
            "What additional client requirement does Redis Cluster Mode Enabled impose?",
          options: [
            "The client must use TLS for all connections",
            "The client must be Redis Cluster-aware — standard Redis clients do not understand cluster topology",
            "The client must implement its own consistent hashing",
            "The client must connect to all shard primaries simultaneously",
          ],
          correctIndex: 1,
          explanation:
            "Redis Cluster Mode Enabled requires a Redis Cluster-aware client. The standard Redis client does not understand cluster topology and cannot route commands to the correct shard.",
        },
        {
          question:
            "What is the primary benefit of Redis Cluster Mode Enabled over Cluster Mode Disabled?",
          options: [
            "It supports persistence through AOF logging",
            "It enables horizontal write scaling by distributing data across multiple shard primaries",
            "It eliminates the need for read replicas",
            "It allows standard Redis clients without cluster awareness",
          ],
          correctIndex: 1,
          explanation:
            "Cluster Mode Enabled distributes data across multiple shards, each with its own primary. This enables horizontal write scaling — multiple primaries handle writes for their portion of the key space instead of a single primary handling all writes.",
        },
      ],
    },
    {
      heading: "Caching Strategies",
      body: `The caching strategy you choose determines the freshness/consistency tradeoff of your cached data.

**Lazy Loading (Cache-Aside)** is the most common pattern. The application checks the cache before querying the database. On a cache hit, the cached value is returned directly without touching the database. On a cache miss, the application queries the database, writes the result to the cache with an appropriate TTL, and returns the value. The advantages are that only requested data is cached (no wasted memory on unread data) and the application still works if the cache is empty or unavailable. The disadvantage is that the first request for any data always incurs a cache miss, and if the database is updated directly (bypassing the cache), the cached data becomes stale until the TTL expires.

**Write-Through** updates the cache every time the database is written. Every write is two writes: one to the database and one to the cache. This keeps the cache always fresh — there's no stale data — but at the cost of extra write latency and the risk of caching data that's never read. Write-through works best for data that's both frequently written and frequently read.

**TTL (Time to Live)** is complementary to both strategies. Setting a TTL on cache keys ensures that stale data expires automatically, providing a safety net against cache-database divergence. The right TTL depends on how often the data changes and how fresh it needs to be. Too short a TTL means frequent cache misses; too long means users see stale data.

**Cache eviction policies** determine what Redis removes when memory is full. \`allkeys-lru\` (evict the least recently used key) is a good general default for caches. \`volatile-lru\` applies LRU eviction only to keys with TTLs set. \`noeviction\` returns an error when memory is full — never appropriate for a cache.`,
      quiz: [
        {
          question:
            "What is a key disadvantage of the lazy loading (cache-aside) caching strategy?",
          options: [
            "Every write requires two operations — one to the database and one to the cache",
            "The first request for any data always incurs a cache miss, and direct database updates cause stale cache data",
            "It requires the cache to be pre-populated before the application starts",
            "It does not support TTL-based expiration",
          ],
          correctIndex: 1,
          explanation:
            "With lazy loading, the first request for any piece of data always misses the cache (cold start). Also, if the database is updated directly without invalidating the cache, the cached value becomes stale until TTL expires.",
        },
        {
          question:
            "Which Redis eviction policy is recommended as a general default for caching workloads?",
          options: [
            "noeviction",
            "volatile-lru",
            "allkeys-lru",
            "allkeys-random",
          ],
          correctIndex: 2,
          explanation:
            "allkeys-lru evicts the least recently used key from the entire keyspace when memory is full. It is the recommended general default for caching workloads. noeviction returns errors when memory is full and is never appropriate for a cache.",
        },
        {
          question:
            "What is the tradeoff of write-through caching compared to lazy loading?",
          options: [
            "Write-through has stale data; lazy loading is always fresh",
            "Write-through adds extra write latency and may cache data that is never read; lazy loading has cache misses on first access",
            "Write-through only works with Memcached; lazy loading requires Redis",
            "Write-through requires manual cache invalidation; lazy loading is automatic",
          ],
          correctIndex: 1,
          explanation:
            "Write-through adds extra write latency (every write goes to both database and cache) and may fill the cache with data that is never read. Lazy loading avoids unnecessary caching but has cold-start misses and potential stale data.",
        },
      ],
    },
    {
      heading: "Security",
      body: `ElastiCache for Redis provides several security mechanisms that should all be used together in production.

**Encryption in transit** secures data between your application and the cache cluster using TLS. Enabling this requires your Redis client to use a TLS-capable connection. **Encryption at rest** encrypts the data stored in Redis (including RDB snapshots and AOF files) using KMS — this is only available for Redis, not Memcached.

For authentication, Redis supports two approaches. **Redis AUTH** is the legacy single-password mechanism: any client that knows the password can connect. **Redis RBAC** (Role-Based Access Control), available in Redis 6+, creates named users with specific permissions for which commands they can execute and which key namespaces they can access. Users are assigned to a user group, and the group is attached to the cluster. RBAC is more granular and auditable than AUTH.

ElastiCache clusters run inside your VPC and are not publicly accessible. **Security groups** control which sources can reach the cluster on the Redis port (6379) or Memcached port (11211). The typical pattern is an application-tier security group that allows inbound connections from your ECS task security group or Lambda — nothing else. **Subnet groups** define which subnets ElastiCache can use for node placement; these should always be private subnets with no public internet route.`,
      quiz: [
        {
          question:
            "Which ElastiCache authentication mechanism provides command-level and key namespace access control for Redis 6+?",
          options: [
            "Redis AUTH (single password)",
            "Redis RBAC (Role-Based Access Control)",
            "IAM-based authentication",
            "TLS client certificates",
          ],
          correctIndex: 1,
          explanation:
            "Redis RBAC (available in Redis 6+) creates named users with specific permissions for commands and key namespaces. It is more granular and auditable than the legacy AUTH single-password mechanism.",
        },
        {
          question: "What is the default port for Redis in ElastiCache?",
          options: ["5432", "3306", "6379", "11211"],
          correctIndex: 2,
          explanation:
            "Redis uses port 6379 by default. Memcached uses port 11211. Security groups should restrict access to these ports to only authorized application-tier security groups.",
        },
        {
          question:
            "Encryption at rest with KMS is available for which ElastiCache engine?",
          options: [
            "Memcached only",
            "Redis only",
            "Both Redis and Memcached",
            "Neither — ElastiCache does not support KMS encryption",
          ],
          correctIndex: 1,
          explanation:
            "Encryption at rest with KMS is only available for Redis, not Memcached. It encrypts stored data including RDB snapshots and AOF files.",
        },
      ],
    },
    {
      heading: "ElastiCache Patterns",
      body: `Several patterns come up repeatedly when designing ElastiCache architectures.

**Session Store** is the most common pattern for web applications. Instead of storing user sessions in memory on each application server (which breaks horizontal scaling — if a user's request goes to a different server, their session is lost), you store sessions in Redis. Every application server reads from and writes to the same Redis cluster, making application servers truly stateless. TTL on session keys provides automatic expiry. This pattern enables horizontal scaling of your web tier without sticky sessions.

**Database Query Cache** stores the results of expensive SQL or NoSQL queries in Redis. The cache key is typically a hash of the query string and parameters. When the underlying data changes, you can either delete the cache key to force a miss on the next request or rely on TTL expiry. A well-tuned query cache can reduce database load by an order of magnitude on read-heavy applications.

**Leaderboards with Sorted Sets** exploit Redis's native sorted set data structure. \`ZADD\` adds or updates a score, \`ZRANK\` retrieves a player's rank, and \`ZRANGE\` with \`WITHSCORES\` retrieves a range of entries with their scores — all in O(log N) time. A global leaderboard that would require expensive SQL \`ORDER BY\` queries becomes a single Redis call.

**Rate Limiting** uses Redis's atomic \`INCR\` command combined with \`EXPIRE\`. Increment a counter keyed by user ID and time window, and compare it to your rate limit threshold. Because \`INCR\` is atomic in Redis, there's no race condition between checking and incrementing the counter.`,
      quiz: [
        {
          question:
            "Why is storing user sessions in ElastiCache Redis better than storing them in application server memory?",
          options: [
            "Redis is faster than application server memory for session reads",
            "It makes application servers stateless, enabling horizontal scaling without sticky sessions",
            "Redis sessions are automatically replicated to S3 for backup",
            "It reduces the number of HTTP requests per user session",
          ],
          correctIndex: 1,
          explanation:
            "Storing sessions in Redis makes application servers stateless — any server can handle any request by reading the session from Redis. This enables horizontal scaling without sticky sessions, which would tie users to specific servers.",
        },
        {
          question:
            "Which Redis command atomically increments a counter for rate limiting?",
          options: ["SET with NX flag", "INCR", "APPEND", "HINCRBY"],
          correctIndex: 1,
          explanation:
            "Redis INCR atomically increments a counter. Combined with EXPIRE to set a time window, it implements race-condition-free rate limiting per user ID or IP address.",
        },
        {
          question:
            "What is the time complexity of Redis sorted set operations like ZADD and ZRANK?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
          correctIndex: 1,
          explanation:
            "Redis sorted set operations (ZADD, ZRANK, ZRANGE) run in O(log N) time. This makes them highly efficient for leaderboards even with millions of entries.",
        },
      ],
    },
    {
      heading: "ElastiCache with Other Services",
      body: `**ElastiCache + RDS** is the foundational pattern for improving read performance on relational databases. On a cache miss, the application queries RDS and populates the cache. On subsequent reads, the cache serves the result. This pattern can reduce RDS query load dramatically for applications with high read-to-write ratios. When RDS data changes, the cache key must be invalidated to prevent stale reads.

**ElastiCache + Lambda** requires the Lambda function to run inside the same VPC as the ElastiCache cluster, since ElastiCache has no public endpoint. Initialize the Redis connection outside the handler function to reuse it across warm invocations — establishing a new TCP connection on every invocation would add significant latency for short-lived Lambda functions.

**ElastiCache + ECS** follows the same connection reuse principle. Stateless ECS containers connect to Redis for session state, making the application tier horizontally scalable. The ECS task security group needs permission to connect to the ElastiCache security group on port 6379.

For secret management, store Redis AUTH passwords or RBAC user credentials in **Secrets Manager** and fetch them at startup. This enables credential rotation without redeploying your application — the application just needs to handle connection reestablishment when credentials change.`,
      quiz: [
        {
          question:
            "A Lambda function needs to connect to ElastiCache Redis. What networking configuration is required?",
          options: [
            "The Lambda function must have a public IP address to reach ElastiCache",
            "The Lambda function must be deployed in the same VPC as the ElastiCache cluster",
            "ElastiCache must have a VPC endpoint configured for Lambda access",
            "No special configuration is needed — ElastiCache is publicly accessible",
          ],
          correctIndex: 1,
          explanation:
            "ElastiCache has no public endpoint — it runs inside your VPC. Lambda functions must be deployed in the same VPC (with appropriate subnet and security group configuration) to connect to ElastiCache.",
        },
        {
          question:
            "For a Lambda function connecting to ElastiCache, where should the Redis connection be initialized?",
          options: [
            "Inside the handler function on every invocation",
            "Outside the handler function, at module initialization, to reuse the connection across warm invocations",
            "In a Lambda layer that runs before each invocation",
            "In a separate Lambda function that manages connection pooling",
          ],
          correctIndex: 1,
          explanation:
            "Initialize the Redis connection outside the handler function at module level. Warm Lambda invocations reuse the same execution environment and can reuse the existing connection, avoiding the latency of establishing a new TCP connection on every invocation.",
        },
        {
          question:
            "Where should Redis AUTH passwords or RBAC credentials be stored in a production architecture?",
          options: [
            "In Lambda environment variables as plaintext",
            "In AWS Secrets Manager, fetched at application startup",
            "Hardcoded in the application source code",
            "In an SSM Parameter Store String (unencrypted) parameter",
          ],
          correctIndex: 1,
          explanation:
            "Store Redis credentials in Secrets Manager and fetch them at startup. This enables credential rotation without redeployment and keeps credentials out of code, environment variables, and configuration files.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer needs to implement a real-time game leaderboard that ranks millions of players. Which ElastiCache Redis data structure is most appropriate?",
      options: [
        "Redis Lists with LPUSH and LRANGE",
        "Redis Sorted Sets with ZADD, ZRANK, and ZRANGE",
        "Redis Hashes with HSET and HGETALL",
        "Redis Strings with SET and GET",
      ],
      correctIndex: 1,
      explanation:
        "Redis Sorted Sets are purpose-built for leaderboards. ZADD adds/updates scores, ZRANK retrieves rank, and ZRANGE retrieves a range of players with scores — all in O(log N) time, far more efficient than SQL ORDER BY at scale.",
    },
    {
      question:
        "An application uses lazy loading with ElastiCache. A database record is updated directly without invalidating the cache. What happens?",
      options: [
        "The cache is automatically invalidated by ElastiCache when it detects the database change",
        "The cache returns stale data until the TTL expires or the key is manually invalidated",
        "Subsequent reads bypass the cache automatically until the next cache miss",
        "The database update fails because the cache is out of sync",
      ],
      correctIndex: 1,
      explanation:
        "With lazy loading, if the database is updated without invalidating the cache key, the cache returns stale data until the TTL expires or the key is explicitly deleted. This is a known tradeoff of the lazy loading pattern.",
    },
    {
      question:
        "Which ElastiCache Redis configuration enables horizontal write scaling by distributing data across multiple shard primaries?",
      options: [
        "Cluster Mode Disabled with multiple read replicas",
        "Cluster Mode Enabled with multiple shards",
        "Multi-AZ replication with automatic failover",
        "Redis AUTH with RBAC user groups",
      ],
      correctIndex: 1,
      explanation:
        "Redis Cluster Mode Enabled distributes data across multiple shards, each with its own primary that handles writes for its portion of the key space. This enables horizontal write scaling beyond what a single primary can handle.",
    },
    {
      question:
        "Why must a Lambda function be deployed in the same VPC as ElastiCache?",
      options: [
        "Because ElastiCache requires VPC-level IAM authentication",
        "Because ElastiCache has no public endpoint — it is only accessible from within the VPC",
        "Because Lambda cannot make TCP connections to external services",
        "Because ElastiCache uses a private API that only works within AWS VPCs",
      ],
      correctIndex: 1,
      explanation:
        "ElastiCache clusters run inside a VPC and have no public endpoint. Lambda functions must be deployed in the same VPC with the appropriate security group rules to connect to ElastiCache.",
    },
    {
      question:
        "Which Redis eviction policy is recommended for general caching workloads when memory is full?",
      options: [
        "noeviction — return errors rather than evicting data",
        "volatile-lru — evict only keys with TTL set",
        "allkeys-lru — evict the least recently used key from the entire keyspace",
        "allkeys-random — evict a random key from the entire keyspace",
      ],
      correctIndex: 2,
      explanation:
        "allkeys-lru is the recommended general caching eviction policy. It evicts the least recently used key when memory is full. noeviction is never appropriate for a cache as it causes errors instead of evicting old data.",
    },
    {
      question:
        "What is the primary advantage of storing user sessions in ElastiCache Redis over storing them in application server memory?",
      options: [
        "Redis sessions are encrypted with KMS automatically",
        "Application servers become stateless, enabling horizontal scaling without sticky sessions",
        "Redis provides faster session access than in-memory storage",
        "Redis sessions are automatically backed up to S3",
      ],
      correctIndex: 1,
      explanation:
        "Storing sessions in Redis makes application servers stateless — any server can handle any request by reading the session from Redis. This enables horizontal scaling of the web tier without requiring sticky sessions that would tie users to specific servers.",
    },
    {
      question:
        "Which ElastiCache feature is only available for Redis and NOT for Memcached?",
      options: [
        "In-memory key-value storage",
        "Horizontal scaling by adding nodes",
        "Encryption at rest with KMS",
        "Auto-discovery for client connections",
      ],
      correctIndex: 2,
      explanation:
        "Encryption at rest with KMS is only available for Redis, not Memcached. Redis also has unique features like persistence, replication, complex data structures, and RBAC that Memcached does not support.",
    },
    {
      question:
        "A team wants to implement rate limiting without race conditions in their API. Which Redis approach should they use?",
      options: [
        "SET with NX flag and a manual check-then-increment pattern",
        "INCR to atomically increment a counter combined with EXPIRE to set the time window",
        "LPUSH to a list and LLEN to check the count",
        "ZADD to a sorted set and ZCARD to count entries",
      ],
      correctIndex: 1,
      explanation:
        "INCR atomically increments a counter (no race condition between check and increment) and EXPIRE sets the time window after which the counter resets. This is the standard Redis rate limiting pattern.",
    },
  ],
};
