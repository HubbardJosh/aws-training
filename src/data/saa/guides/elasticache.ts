import { ServiceGuide } from "../../../types/guide";

export const elasticacheGuide: ServiceGuide = {
  id: "saa-elasticache",
  service: "Amazon ElastiCache",
  domain: "services",
  tagline:
    "In-memory caching with Redis and Memcached for sub-millisecond data access",
  intro:
    "Amazon ElastiCache is a fully managed in-memory caching service supporting Redis and Memcached engines that reduces database load, improves application response times to sub-millisecond latency, and enables session management, leaderboards, real-time analytics, and pub/sub messaging patterns.",

  sections: [
    {
      heading: "Redis vs. Memcached: Choosing the Right Engine",
      body: `The choice between Redis and Memcached is one of the most frequently tested ElastiCache decisions. Memcached is a simple, multi-threaded cache designed for pure caching of simple key-value pairs — it supports horizontal scaling through sharding, has no persistence, no replication, and no support for complex data structures. Memcached is appropriate when you need the simplest possible caching layer with multiple CPU cores utilized effectively and no need for data durability. Redis is significantly more feature-rich: it supports complex data structures (strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, geospatial indexes), persistence (RDB snapshots and AOF logs), replication with automatic failover, pub/sub messaging, Lua scripting, and transactions. For the SAA-C03 exam, Redis is the answer for almost all use cases requiring persistence, high availability, complex data types, leaderboards, pub/sub, geospatial queries, or session storage that must survive a cache node failure.`,
      quiz: [
        {
          question:
            "A gaming application needs a leaderboard with O(log N) score updates and range queries. Which ElastiCache engine and data structure should be used?",
          options: [
            "Redis with sorted sets",
            "Memcached with integer counters",
            "Redis with a hash map keyed by player ID",
            "Memcached with a sorted list data structure",
          ],
          correctIndex: 0,
          explanation:
            "Redis sorted sets are the canonical data structure for leaderboards. They maintain scores in sorted order with O(log N) updates and support range queries (e.g., top 10 players), making them ideal for gaming leaderboards. Memcached does not support complex data structures.",
        },
        {
          question:
            "Which ElastiCache engine supports persistence, replication with automatic failover, and pub/sub messaging?",
          options: [
            "Both Memcached and Redis support these features",
            "Neither — ElastiCache is a pure in-memory cache with no persistence",
            "Redis — feature-rich with persistence, HA replication, and pub/sub",
            "Memcached — multi-threaded and horizontally scalable",
          ],
          correctIndex: 2,
          explanation:
            "Redis supports persistence (RDB/AOF), replication with automatic failover (Multi-AZ), pub/sub messaging, sorted sets, and other complex data structures. Memcached supports none of these — it is a simple key-value cache.",
        },
        {
          question:
            "When is Memcached the appropriate ElastiCache engine choice?",
          options: [
            "When session data must survive a cache node failure",
            "When the simplest possible pure key-value caching is needed with multi-threaded performance and horizontal sharding",
            "When pub/sub messaging between application components is required",
            "When the application needs sorted sets for leaderboards",
          ],
          correctIndex: 1,
          explanation:
            "Memcached is appropriate for simple key-value caching workloads that benefit from multi-threaded performance and horizontal sharding. It has no persistence, replication, or complex data structure support. Redis is required for any use case needing those features.",
        },
      ],
    },
    {
      heading: "Redis Cluster Mode and Replication Groups",
      body: `A Redis replication group consists of a primary node that handles writes and up to five read replica nodes that replicate asynchronously and serve reads. If the primary node fails, ElastiCache automatically promotes a replica to primary within minutes (Multi-AZ with auto-failover enabled). Read replicas reduce load on the primary by distributing read traffic and provide a failover target, making them both a scalability and availability feature. Redis Cluster Mode Enabled divides the keyspace into 16,384 hash slots distributed across multiple shards (each shard is a primary + replicas), enabling horizontal write scaling beyond the capacity of a single node. Cluster mode supports up to 500 nodes (250 shards with one replica each), enabling datasets too large for a single node. Cluster mode requires all node types to be the same, uses the Redis Cluster protocol (requiring cluster-aware clients), and does not support multiple databases — all data lives in database 0.`,
      quiz: [
        {
          question:
            "How many read replica nodes can a Redis replication group (without Cluster Mode) have?",
          options: [
            "Up to 15 replicas",
            "Up to 2 replicas",
            "Up to 5 replicas",
            "Unlimited replicas",
          ],
          correctIndex: 2,
          explanation:
            "A Redis replication group without Cluster Mode supports up to 5 read replica nodes alongside the primary. These replicas serve read traffic and act as failover targets when Multi-AZ with auto-failover is enabled.",
        },
        {
          question:
            "What problem does Redis Cluster Mode Enabled solve that a single-primary replication group cannot?",
          options: [
            "It enables strongly consistent reads across all shards",
            "It supports multiple database indexes (db0 through db15) simultaneously",
            "It enables cross-region replication for disaster recovery",
            "It allows horizontal write scaling beyond the capacity of a single primary node by distributing the keyspace across multiple shards",
          ],
          correctIndex: 3,
          explanation:
            "Redis Cluster Mode distributes the keyspace across multiple shards (each with its own primary), enabling horizontal write scaling beyond a single node's capacity. Without Cluster Mode, only one node handles writes, limiting write throughput.",
        },
      ],
    },
    {
      heading: "Caching Strategies",
      body: `The caching strategy determines how data flows between the cache and the database. Lazy loading (cache-aside) is the most common pattern: the application checks the cache first, and on a cache miss reads from the database and writes the result to the cache for future requests. Lazy loading ensures only requested data is cached but suffers from a cache miss penalty (three round trips: cache miss, DB read, cache write) and stale data if the cache TTL is too long. Write-through writes to both the cache and the database simultaneously on every write, ensuring the cache always has fresh data at the cost of write latency and caching data that may never be read again. Write-behind (write-back) writes to the cache immediately and asynchronously persists to the database, improving write throughput at the risk of data loss if the cache node fails before persistence completes. TTL (Time to Live) applies to both strategies to prevent stale data from accumulating indefinitely — the appropriate TTL balances freshness requirements against cache hit rate.`,
      quiz: [
        {
          question:
            "Which caching strategy writes to both the cache and database simultaneously on every write, ensuring the cache always contains fresh data?",
          options: [
            "Write-behind (write-back)",
            "Read-through",
            "Write-through",
            "Lazy loading (cache-aside)",
          ],
          correctIndex: 2,
          explanation:
            "Write-through writes to both the cache and database simultaneously on every write. This ensures the cache is always fresh but adds write latency and may cache data that is never read again.",
        },
        {
          question:
            "What is the main drawback of lazy loading (cache-aside) caching strategy?",
          options: [
            "It requires changes to the database schema",
            "It writes stale data to the cache on every write operation",
            "It does not support TTL expiration on cached items",
            "Cache misses incur a three-step penalty: cache miss detection, database read, and cache write",
          ],
          correctIndex: 3,
          explanation:
            "Lazy loading suffers from a cache miss penalty: the application must detect the miss, read from the database, then write to the cache before returning the result — three round trips instead of one. It also risks serving stale data if the TTL is too long.",
        },
      ],
    },
    {
      heading: "Session Store and Common Architecture Patterns",
      body: `ElastiCache Redis is the standard session store for web applications deployed across multiple EC2 instances or containers. Instead of storing session data in-process (which ties users to specific instances and prevents horizontal scaling) or in the database (which adds latency), sessions are stored in Redis with a TTL equal to the session expiration time. Any application instance can retrieve the session from Redis, enabling true stateless application instances that can be freely scaled and replaced. Other common patterns include database query caching (storing frequently executed, expensive query results in Redis with a TTL), API response caching (caching the output of external API calls to reduce costs and improve resilience), rate limiting (using Redis atomic increment operations on a key with a TTL to implement per-user API rate limits), and leaderboards (using Redis sorted sets to maintain ranked scores with O(log N) updates and range queries).`,
      quiz: [
        {
          question:
            "A web application stores HTTP sessions in memory on each EC2 instance. Users are tied to specific instances, preventing horizontal scaling. What is the recommended architectural fix?",
          options: [
            "Enable sticky sessions on the Application Load Balancer",
            "Use DynamoDB for session storage with On-Demand capacity mode",
            "Increase the size of each EC2 instance to handle more concurrent sessions",
            "Store sessions in ElastiCache Redis with a TTL equal to the session expiration time",
          ],
          correctIndex: 3,
          explanation:
            "Storing sessions in ElastiCache Redis decouples sessions from specific instances, allowing any application server to retrieve any user's session. This enables true stateless instances that can be scaled, replaced, or load-balanced freely.",
        },
        {
          question:
            "How does ElastiCache Redis implement per-user API rate limiting efficiently?",
          options: [
            "Using sorted sets to track request timestamps per user",
            "Using atomic increment operations (INCR) on a key with a TTL to count requests in a time window",
            "Using Redis pub/sub to broadcast rate limit events to all application instances",
            "Using Redis Streams to queue and throttle API requests",
          ],
          correctIndex: 1,
          explanation:
            "Redis atomic INCR operations on a key with a TTL implement rate limiting: increment a counter per user per time window, and reject requests when the counter exceeds the threshold. The TTL resets the counter automatically when the window expires.",
        },
      ],
    },
    {
      heading: "Security: VPC, Encryption, and Auth",
      body: `ElastiCache clusters should always be deployed in private subnets within a VPC — they should never be directly accessible from the internet. Access is controlled at the network level using security groups that allow inbound traffic only from application tier security groups on the Redis port (6379) or Memcached port (11211). Redis AUTH requires clients to provide a password before executing commands, providing a basic authentication layer. Redis 6.0+ supports Role-Based Access Control (RBAC) with ACL users, enabling fine-grained permission control per user (read-only users, write-only users, users restricted to specific key patterns). Encryption in transit uses TLS for all client-to-node and node-to-node communication. Encryption at rest uses AWS KMS to encrypt the underlying storage for Redis clusters — Memcached does not support encryption at rest. For compliance-sensitive workloads, Redis is the appropriate engine given its superior security feature set.`,
      quiz: [
        {
          question:
            "A compliance requirement mandates encryption at rest for the caching layer. Which ElastiCache engine supports this?",
          options: [
            "Memcached — it supports KMS encryption at rest",
            "Both Redis and Memcached support KMS encryption at rest",
            "Redis — it supports KMS encryption at rest; Memcached does not",
            "Neither — ElastiCache does not support encryption at rest",
          ],
          correctIndex: 2,
          explanation:
            "Redis supports encryption at rest using AWS KMS. Memcached does not support encryption at rest. For compliance-sensitive workloads requiring data protection at rest, Redis is the required engine.",
        },
        {
          question:
            "Which security configuration prevents direct internet access to an ElastiCache cluster?",
          options: [
            "Enable Redis ACL users with read-only permissions",
            "Enable Redis AUTH with a strong password",
            "Use TLS encryption for all connections",
            "Deploy the cluster in private subnets with security groups allowing only application tier access",
          ],
          correctIndex: 3,
          explanation:
            "ElastiCache clusters should always be deployed in private VPC subnets. Security groups restrict access to only the application tier (by referencing the app tier's security group), preventing any direct internet access.",
        },
      ],
    },
    {
      heading: "Scaling and Performance Tuning",
      body: `ElastiCache scaling takes two forms. Vertical scaling (changing the node type) requires creating a new cluster with a larger node type and migrating data — there is no in-place vertical scaling for Memcached; for Redis, modifying the node type triggers a controlled failover. Horizontal scaling for Redis Cluster Mode adds or removes shards by resharding the keyspace — ElastiCache handles the online resharding process without downtime by migrating hash slots progressively. For Memcached, horizontal scaling adds or removes nodes, with the client library redistributing keys using consistent hashing. Eviction policies control what happens when the cache reaches its memory limit: \`allkeys-lru\` evicts the least recently used keys across all keys (recommended for general caching), \`volatile-lru\` evicts only keys with a TTL set, and \`noeviction\` returns an error on write when memory is full (appropriate for session stores where data loss is unacceptable). Monitoring cache hit rate, evictions, and memory usage via CloudWatch metrics guides capacity planning and eviction policy tuning.`,
      quiz: [
        {
          question:
            "Which Redis eviction policy is recommended for general caching workloads where all keys should be eligible for eviction?",
          options: [
            "volatile-lru — evicts keys with TTL only",
            "noeviction — returns an error when memory is full",
            "allkeys-random — evicts a random key from all keys",
            "allkeys-lru — evicts the least recently used key from all keys",
          ],
          correctIndex: 3,
          explanation:
            "allkeys-lru evicts the least recently used key from all keys when memory is full. This is recommended for general caching because it keeps the most recently accessed data in cache regardless of whether a TTL was set.",
        },
        {
          question:
            "An ElastiCache Redis Cluster Mode instance needs more write throughput. What is the correct scaling approach?",
          options: [
            "Add additional shards — ElastiCache online resharding migrates hash slots without downtime",
            "Add more read replica nodes to the existing shard",
            "Increase the node type for vertical scaling of write capacity",
            "Enable Multi-AZ failover to distribute write traffic across AZs",
          ],
          correctIndex: 0,
          explanation:
            "In Redis Cluster Mode, horizontal write scaling is achieved by adding shards. ElastiCache handles online resharding by migrating hash slots progressively without downtime. Adding replicas improves read throughput but does not increase write capacity.",
        },
      ],
    },
  ],

  keyFacts: [
    "Redis: complex data types, persistence, replication, pub/sub, sorted sets, geospatial",
    "Memcached: simple key-value, multi-threaded, horizontal sharding only, no persistence or replication",
    "Redis replication group: 1 primary + up to 5 replicas, auto-failover with Multi-AZ",
    "Redis Cluster Mode: multiple shards across 16,384 hash slots for horizontal write scaling",
    "Lazy loading caches on first read (miss penalty); write-through caches on every write",
    "ElastiCache is the standard session store for stateless, horizontally scaled web applications",
    "Redis AUTH and ACL (Redis 6+) provide authentication and fine-grained authorization",
    "Encryption in transit (TLS) and at rest (KMS) supported for Redis; Memcached lacks at-rest encryption",
    "allkeys-lru eviction is recommended for general caching workloads",
    "ElastiCache must be in private subnets — never expose cache ports to the internet",
  ],

  relatedServices: [
    "Amazon RDS",
    "Amazon DynamoDB",
    "Amazon EC2",
    "Amazon ECS",
    "AWS Lambda",
    "Amazon VPC",
  ],

  examTips: [
    "Redis = the answer for persistence, HA, sorted sets, pub/sub, geospatial, and session storage",
    "Memcached = only for simple key-value caching needing multi-threaded performance and horizontal sharding",
    "Session store in ElastiCache Redis = stateless application servers that scale freely",
    "Lazy loading: cache miss penalty; write-through: write latency — choose based on read vs. write sensitivity",
    "Redis sorted sets enable leaderboards with O(log N) operations — a common exam scenario",
    "Cache eviction with noeviction = error on memory full — use for session stores, not general caches",
    "Redis Cluster Mode enables horizontal write scaling; without it, only the primary handles writes",
    "For strongly consistent reads from the database, bypass ElastiCache — caching is always eventually consistent",
  ],

  topicQuiz: [
    {
      question:
        "A web application needs to store HTTP session data that survives an EC2 instance failure and allows any server to handle any user's requests. Which solution is correct?",
      options: [
        "Store sessions in ElastiCache Redis with a TTL equal to the session timeout",
        "Use ALB sticky sessions to tie users to specific instances",
        "Store sessions in the EC2 instance local file system",
        "Store sessions in RDS MySQL for durability",
      ],
      correctIndex: 0,
      explanation:
        "ElastiCache Redis is the standard session store for stateless web applications. Sessions stored in Redis are accessible from any application instance and survive individual EC2 failures. This enables horizontal scaling without sticky sessions.",
    },
    {
      question:
        "Which ElastiCache engine should be used when the application requires a pub/sub messaging system between microservices?",
      options: [
        "Memcached — it has built-in pub/sub support",
        "Neither — use Amazon SNS for pub/sub between microservices",
        "Redis — it supports pub/sub messaging natively",
        "Either engine — both support pub/sub equally",
      ],
      correctIndex: 2,
      explanation:
        "Redis supports pub/sub messaging natively. Memcached does not support pub/sub. For microservice messaging via an in-memory broker, Redis is the correct engine.",
    },
    {
      question:
        "A compliance requirement mandates encryption at rest for all data stores including the caching layer. Which ElastiCache configuration satisfies this?",
      options: [
        "ElastiCache Redis with encryption at rest using AWS KMS",
        "ElastiCache Redis with in-transit TLS encryption only",
        "ElastiCache Memcached with KMS encryption enabled",
        "Memcached with client-side encryption",
      ],
      correctIndex: 0,
      explanation:
        "Only Redis supports encryption at rest via AWS KMS. Memcached does not support encryption at rest. For compliance requirements, Redis must be used.",
    },
    {
      question:
        "Which caching strategy ensures the cache is always consistent with the database but increases write latency?",
      options: [
        "Lazy loading — writes to cache on first read miss",
        "Write-through — writes to cache and database simultaneously on every write",
        "Write-behind — writes to cache immediately and asynchronously to the database",
        "Read-through — database populates the cache on misses",
      ],
      correctIndex: 1,
      explanation:
        "Write-through writes to both the cache and database simultaneously, ensuring the cache is always current. The trade-off is increased write latency because both writes must complete before the operation is acknowledged.",
    },
    {
      question:
        "An ElastiCache Redis cluster is running out of memory and needs to scale horizontally for write capacity. Which approach achieves this?",
      options: [
        "Add more read replicas to the existing replication group",
        "Increase the node instance type for more memory",
        "Enable Redis Cluster Mode and add shards to distribute the keyspace",
        "Enable Multi-AZ failover to distribute write traffic",
      ],
      correctIndex: 2,
      explanation:
        "Redis Cluster Mode distributes the keyspace across multiple shards, each with its own primary node. Adding shards increases both memory capacity and write throughput. Adding replicas only increases read capacity.",
    },
    {
      question:
        "What eviction policy should be configured for a Redis session store where data loss is unacceptable when memory is full?",
      options: [
        "noeviction — return an error on write when memory is full",
        "allkeys-random — evict a random session",
        "volatile-lru — evict sessions with TTL set",
        "allkeys-lru — evict least recently used session",
      ],
      correctIndex: 0,
      explanation:
        "noeviction returns an error when the cache is full rather than evicting data. For session stores where losing a session is unacceptable, noeviction forces the application to handle the error and prevents silent data loss.",
    },
    {
      question:
        "A gaming company needs a real-time leaderboard that maintains player scores in ranked order with fast updates. Which ElastiCache data structure is the correct choice?",
      options: [
        "Redis hash map with player ID and score fields",
        "Redis sorted set with scores as the sort value",
        "Memcached hash with player IDs as keys",
        "Redis list with score-player tuples",
      ],
      correctIndex: 1,
      explanation:
        "Redis sorted sets maintain elements with associated scores in sorted order. ZADD (O log N) updates a score, ZRANGE retrieves a rank range, and ZRANK returns a player's rank — exactly the operations needed for a leaderboard.",
    },
    {
      question: "For which use case is Memcached more appropriate than Redis?",
      options: [
        "Implementing a pub/sub event system between services",
        "Maintaining a geospatial index of user locations",
        "Storing session data that must survive node failures",
        "Simple high-throughput key-value caching using multiple CPU cores with no persistence or HA needed",
      ],
      correctIndex: 3,
      explanation:
        "Memcached is multi-threaded and excels at simple key-value caching that benefits from multiple CPU cores. When persistence, high availability, complex data types, and pub/sub are not needed, Memcached's simplicity is an advantage.",
    },
  ],
};
