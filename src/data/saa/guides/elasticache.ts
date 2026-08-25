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
    },
    {
      heading: "Redis Cluster Mode and Replication Groups",
      body: `A Redis replication group consists of a primary node that handles writes and up to five read replica nodes that replicate asynchronously and serve reads. If the primary node fails, ElastiCache automatically promotes a replica to primary within minutes (Multi-AZ with auto-failover enabled). Read replicas reduce load on the primary by distributing read traffic and provide a failover target, making them both a scalability and availability feature. Redis Cluster Mode Enabled divides the keyspace into 16,384 hash slots distributed across multiple shards (each shard is a primary + replicas), enabling horizontal write scaling beyond the capacity of a single node. Cluster mode supports up to 500 nodes (250 shards with one replica each), enabling datasets too large for a single node. Cluster mode requires all node types to be the same, uses the Redis Cluster protocol (requiring cluster-aware clients), and does not support multiple databases — all data lives in database 0.`,
    },
    {
      heading: "Caching Strategies",
      body: `The caching strategy determines how data flows between the cache and the database. Lazy loading (cache-aside) is the most common pattern: the application checks the cache first, and on a cache miss reads from the database and writes the result to the cache for future requests. Lazy loading ensures only requested data is cached but suffers from a cache miss penalty (three round trips: cache miss, DB read, cache write) and stale data if the cache TTL is too long. Write-through writes to both the cache and the database simultaneously on every write, ensuring the cache always has fresh data at the cost of write latency and caching data that may never be read again. Write-behind (write-back) writes to the cache immediately and asynchronously persists to the database, improving write throughput at the risk of data loss if the cache node fails before persistence completes. TTL (Time to Live) applies to both strategies to prevent stale data from accumulating indefinitely — the appropriate TTL balances freshness requirements against cache hit rate.`,
    },
    {
      heading: "Session Store and Common Architecture Patterns",
      body: `ElastiCache Redis is the standard session store for web applications deployed across multiple EC2 instances or containers. Instead of storing session data in-process (which ties users to specific instances and prevents horizontal scaling) or in the database (which adds latency), sessions are stored in Redis with a TTL equal to the session expiration time. Any application instance can retrieve the session from Redis, enabling true stateless application instances that can be freely scaled and replaced. Other common patterns include database query caching (storing frequently executed, expensive query results in Redis with a TTL), API response caching (caching the output of external API calls to reduce costs and improve resilience), rate limiting (using Redis atomic increment operations on a key with a TTL to implement per-user API rate limits), and leaderboards (using Redis sorted sets to maintain ranked scores with O(log N) updates and range queries).`,
    },
    {
      heading: "Security: VPC, Encryption, and Auth",
      body: `ElastiCache clusters should always be deployed in private subnets within a VPC — they should never be directly accessible from the internet. Access is controlled at the network level using security groups that allow inbound traffic only from application tier security groups on the Redis port (6379) or Memcached port (11211). Redis AUTH requires clients to provide a password before executing commands, providing a basic authentication layer. Redis 6.0+ supports Role-Based Access Control (RBAC) with ACL users, enabling fine-grained permission control per user (read-only users, write-only users, users restricted to specific key patterns). Encryption in transit uses TLS for all client-to-node and node-to-node communication. Encryption at rest uses AWS KMS to encrypt the underlying storage for Redis clusters — Memcached does not support encryption at rest. For compliance-sensitive workloads, Redis is the appropriate engine given its superior security feature set.`,
    },
    {
      heading: "Scaling and Performance Tuning",
      body: `ElastiCache scaling takes two forms. Vertical scaling (changing the node type) requires creating a new cluster with a larger node type and migrating data — there is no in-place vertical scaling for Memcached; for Redis, modifying the node type triggers a controlled failover. Horizontal scaling for Redis Cluster Mode adds or removes shards by resharding the keyspace — ElastiCache handles the online resharding process without downtime by migrating hash slots progressively. For Memcached, horizontal scaling adds or removes nodes, with the client library redistributing keys using consistent hashing. Eviction policies control what happens when the cache reaches its memory limit: \`allkeys-lru\` evicts the least recently used keys across all keys (recommended for general caching), \`volatile-lru\` evicts only keys with a TTL set, and \`noeviction\` returns an error on write when memory is full (appropriate for session stores where data loss is unacceptable). Monitoring cache hit rate, evictions, and memory usage via CloudWatch metrics guides capacity planning and eviction policy tuning.`,
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
};
