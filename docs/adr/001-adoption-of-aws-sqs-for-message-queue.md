# ADR 001: Adoption of AWS SQS for Message Queue

**Status:** Accepted

**Date:** 2025-10-31

**Context:** Architecture Design Plugin

**Deciders:** Architecture Team

---

## Context and Problem Statement

We need a reliable message queue solution for asynchronous processing, background jobs, and distributed system communication. The solution must:

- Support local development with minimal infrastructure overhead
- Provide production-grade reliability and scalability
- Integrate seamlessly with AWS cloud infrastructure
- Allow developers to test queue-based workflows locally
- Maintain architectural independence (Clean Architecture principles)

**Key Question:** Should we use BullMQ (Redis-based) or AWS SQS (cloud-native) for our message queue infrastructure?

---

## Decision Drivers

- **Cloud-Native Alignment**: Production environment runs on AWS
- **Operational Overhead**: Minimize infrastructure management in production
- **Developer Experience**: Local development must be friction-free
- **Scalability**: Must handle growing message volumes without manual intervention
- **Cost Efficiency**: Optimize for AWS pricing model (pay-per-use)
- **Clean Architecture**: Domain layer must remain infrastructure-agnostic
- **Testing**: Must support isolated testing with fake implementations

---

## Considered Options

### Option 1: BullMQ (Redis-based)

**Pros:**
- ✅ Excellent local developer experience (Bull Board UI, retry mechanisms)
- ✅ Rich feature set (priority queues, delayed jobs, rate limiting)
- ✅ Strong TypeScript support and active community
- ✅ Works seamlessly in Docker Compose local environment

**Cons:**
- ❌ Requires Redis infrastructure management in production
- ❌ Additional operational overhead (scaling, monitoring, backups)
- ❌ Separate technology from AWS ecosystem (added complexity)
- ❌ Need to manage Redis cluster for high availability

### Option 2: AWS SQS (Cloud-Native)

**Pros:**
- ✅ Fully managed service (no infrastructure overhead)
- ✅ Seamless AWS integration (Lambda, SNS, EventBridge)
- ✅ Auto-scaling built-in (no capacity planning)
- ✅ Pay-per-use pricing model (cost-efficient)
- ✅ LocalStack provides local development parity
- ✅ Native support for dead-letter queues (DLQ)
- ✅ Built-in encryption and IAM integration

**Cons:**
- ⚠️ LocalStack simulation not 100% feature-complete
- ⚠️ Less rich local debugging tools compared to Bull Board
- ⚠️ Limited advanced features (no native priority queues)
- ⚠️ Potential vendor lock-in to AWS ecosystem

### Option 3: Hybrid Approach (BullMQ Local, SQS Production)

**Pros:**
- ✅ Best developer experience locally
- ✅ Production benefits of managed service

**Cons:**
- ❌ **Critical flaw**: Different behavior in dev vs prod
- ❌ Integration bugs only discovered in production
- ❌ Violates "production parity" principle
- ❌ Increased complexity (two implementations to maintain)

---

## Decision Outcome

**Chosen option:** AWS SQS with LocalStack for local development

### Rationale

1. **Cloud-Native Strategy**: Production runs on AWS → SQS is the natural choice
2. **Operational Excellence**: Zero infrastructure management vs managing Redis clusters
3. **Development Parity**: LocalStack simulates SQS locally, reducing prod surprises
4. **Clean Architecture**: Port/Adapter pattern abstracts queue implementation
5. **Cost Efficiency**: Pay-per-use SQS vs fixed-cost Redis infrastructure
6. **Scalability**: Auto-scaling without capacity planning

### Architecture Impact

#### Clean Architecture Implementation

```
Domain Layer (Ports):
├── domain/ports/queue.ts          # Queue interface (infrastructure-agnostic)
└── domain/ports/queue-message.ts  # Message interface

Infrastructure Layer (Adapters):
├── infrastructure/adapters/queue/
│   ├── sqs.adapter.ts             # Production SQS implementation
│   ├── localstack-sqs.adapter.ts  # LocalStack development implementation
│   └── fake-queue.adapter.ts      # Test double for unit tests

DI Container (Environment-based registration):
└── infrastructure/container/register-infrastructure.ts
    └── registerQueue() → production vs development vs test
```

#### Example Port Definition

```typescript
// domain/ports/queue.ts
export interface Queue {
  sendMessage(queueUrl: string, message: unknown): Promise<void>;
  receiveMessages(queueUrl: string, maxMessages?: number): Promise<QueueMessage[]>;
  deleteMessage(queueUrl: string, receiptHandle: string): Promise<void>;
}

export interface QueueMessage {
  id: string;
  body: string;
  receiptHandle: string;
  attributes?: Record<string, string>;
}
```

#### DI Container Registration

```typescript
// infrastructure/container/register-infrastructure.ts
import { SQSClient } from '@aws-sdk/client-sqs';

export function registerInfrastructure(container: Container): void {
  if (process.env.NODE_ENV === 'production') {
    // Production: Real AWS SQS
    container.registerSingleton(TOKENS.queue, () =>
      new SqsQueueAdapter(
        new SQSClient({ region: process.env.AWS_REGION })
      )
    );
  } else if (process.env.NODE_ENV === 'test') {
    // Test: Fake implementation
    container.registerSingleton(TOKENS.queue, () => new FakeQueueAdapter());
  } else {
    // Development: LocalStack SQS
    container.registerSingleton(TOKENS.queue, () =>
      new LocalStackSqsAdapter(
        new SQSClient({
          endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
          region: process.env.AWS_REGION || 'us-east-1'
        })
      )
    );
  }
}
```

---

## Consequences

### Positive

- ✅ **No production infrastructure management**: AWS handles scaling, backups, monitoring
- ✅ **Clean Architecture compliance**: Domain layer remains infrastructure-agnostic
- ✅ **Testable**: FakeQueueAdapter enables fast, isolated unit tests
- ✅ **Local development parity**: LocalStack simulates SQS behavior
- ✅ **Cost optimization**: Pay only for messages sent/received
- ✅ **Built-in reliability**: DLQ, encryption, IAM integration

### Negative

- ⚠️ **LocalStack limitations**: Some SQS features may not work 100% locally
- ⚠️ **Reduced local debugging**: No equivalent to Bull Board UI for LocalStack
- ⚠️ **Learning curve**: Team needs to learn SQS vs familiar BullMQ patterns
- ⚠️ **AWS vendor lock-in**: Harder to migrate away from AWS ecosystem

### Mitigations

1. **LocalStack Gaps**: Document known limitations, use integration tests against real SQS in CI/CD
2. **Debugging Tools**: Use AWS CloudWatch locally via LocalStack, create custom monitoring scripts
3. **Knowledge Transfer**: Create internal documentation, run SQS training sessions
4. **Vendor Lock-in**: Port/Adapter pattern makes it possible to swap implementations

---

## Compliance with Architecture Gates

### ✅ Gate 1: Clean Architecture Principles
- **Dependency Rule**: Domain layer defines `Queue` port, infrastructure implements it
- **Port/Adapter Pattern**: Multiple adapters (SQS, LocalStack, Fake) implement same port
- **Testability**: FakeQueueAdapter enables domain logic testing without infrastructure

### ✅ Gate 2: SOLID Principles
- **Dependency Inversion (DIP)**: Use cases depend on `Queue` abstraction, not SQS
- **Open/Closed Principle (OCP)**: New queue implementations extend without modifying domain
- **Interface Segregation (ISP)**: `Queue` interface is minimal and focused

### ✅ Gate 3: Cloud-Native Best Practices
- **12-Factor App**: Configuration via environment variables (`AWS_ENDPOINT`, `AWS_REGION`)
- **Dev/Prod Parity**: LocalStack mimics SQS behavior (not perfect, but close)
- **Disposability**: Stateless queue adapters, easy to replace/restart

---

## Related Decisions

- **ADR 002**: Environment-based Dependency Injection (future)
- **ADR 003**: LocalStack Usage for Local AWS Services (future)

---

## References

- [AWS SQS Documentation](https://docs.aws.amazon.com/sqs/)
- [LocalStack SQS Coverage](https://docs.localstack.cloud/user-guide/aws/sqs/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [BullMQ Documentation](https://docs.bullmq.io/) (alternative considered)

---

## Notes

**Implementation Checklist:**

- [ ] Create `Queue` port in `domain/ports/queue.ts`
- [ ] Implement `SqsQueueAdapter` (production)
- [ ] Implement `LocalStackSqsAdapter` (development)
- [ ] Implement `FakeQueueAdapter` (testing)
- [ ] Update DI container with environment-based registration
- [ ] Configure LocalStack in `docker-compose.yml`
- [ ] Add environment variables to `.env.example`
- [ ] Create integration tests for SQS adapters
- [ ] Document local setup in `README.md`
- [ ] Update CLAUDE.md to reflect SQS usage ✅ (DONE)
- [ ] Update plugin skills to reference SQS instead of BullMQ

**Future Enhancements:**

- Consider AWS EventBridge for complex event routing
- Evaluate SNS+SQS fan-out pattern for pub/sub scenarios
- Investigate SQS FIFO queues for strict ordering requirements
