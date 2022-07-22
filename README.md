### nestjs-discord-webhook-logger

## Usage
```ts
import { DiscordWebhookLogger } from 'nestjs-discord-webhook-logger';

const webhookUrl = ''

export class AppService {
  private logger = new DiscordWebhookLogger(webhookUrl)

  sayHelloWorld() {
    this.logger.log('Hello World!')
  }
}
```

## Advanced Usage
```ts
import { DiscordWebhookLogger } from 'nestjs-discord-webhook-logger';

const webhookUrl = ''
const webhookName = 'My Webhook'
const webhookAvatarUrl = 'https://example.com/avatar.png'

export class AppService {
  private logger = new DiscordWebhookLogger(webhookUrl, webhookName, webhookAvatarUrl)

  sayHelloWorld() {
    this.logger.log('Hello World!', {
      title: 'My Title',
      author: {
        name: 'My Author',
      }
      footer: {
        text: 'My Footer',
      },
    })
  }
}
```

