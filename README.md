# SaaS Boilerplate Project

Welcome to our SaaS Boilerplate Project, an all-in-one starter kit designed to jumpstart your next SaaS application. This boilerplate is built on Next.js using the new App Router, integrated with a variety of authentication methods and powerful backend technologies to provide a robust foundation for scaling your application.

## Features

- **Authentication**: Seamless authentication setup using Lucia-auth with support for Magic Link, Google, Facebook, and GitHub sign-ins.
- **Payments**: Integrated with Stripe for handling subscription-based models. Multiple subscription plans are supported to cater to a diverse customer base.
- **Database**: Utilizes prisma ORM with PostgreSQL, ensuring efficient data handling and scalability.
- **Emails**: Integrated email functionality with Nodemailer for reliable transactional email delivery.
- **Styling**: Styled with Tailwind CSS for rapid UI development without sacrificing design quality.
- **Multilingual Support**: Seamless multilingual setup with i18n to efficiently manage and support multiple languages.

## Getting Started

Follow these steps to get your SaaS project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- PostgreSQL
- A Stripe account
- Google/Facebook/GitHub developer accounts for OAuth setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/meirankri/saas-boilerplate.git
   cd your-project
   ```

2. **Install dependencies**

   ```bash
   npm install || yarn
   ```

3. **Environment setup**

   Copy the .env.exemple to .env update it with your credentials:

   ```env
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_ACCESS_KEY=your_access_key
   CLOUDFLARE_SECRET_KEY=your_secret_key
   CLOUDFLARE_BUCKET=your_bucket_name
   NEXT_PUBLIC_MAX_FILE_SIZE=5 # Maximum file size in MB
   CLOUDFLARE_REGION=auto
   CLOUDFLARE_URL=https://<your-account-id>.r2.cloudflarestorage.com
   ```

4. **Database setup**

   Run the migration scripts to set up your PostgreSQL database schemas:

   ```bash
   npm run generate
   ```

5. **Run the development server**

   Start the server with:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser to see the application in action.

### Get the updates

1.  **Add New Remote for This Repository**

After cloning, rename the original remote and add the new repository's URL as `origin`:

```bash
git remote rename origin upstream
git remote add origin <new-repo-url>
```

This will keep the upstream (original) repository as `upstream` and the new repository as `origin`.

2. **Push to the New Repository**

To push the cloned repository to your new GitHub repository:

```bash
git push -u origin main
```

3.  **Keep Your Repository Updated with Rebase**

Whenever there are updates in the original repository, you can update your fork by fetching the changes and rebasing:

1. Fetch updates from the original repository:

   ```bash
   git fetch upstream
   ```

2. Rebase your changes on top of the new updates:

   ```bash
   git rebase upstream/main
   ```

3. Push the updates to your repository:

   ```bash
   git push origin main
   ```

Following this workflow will ensure that your repository stays in sync with the original project.

## Managing Payments

To manage payments, follow these steps:

1. **Create Products on Stripe**

   First, you need to create your products on Stripe. Each product should have a price and a payment link (`priceId`).

2. **Add Payment Links and Price IDs**

   After creating the products on Stripe, add the payment links and `priceId` to the `pricingList` constant in `app/constants/stripe.ts`. Each plan should have a title, features, and associated products.

   Example structure for `pricingList`:

   ```typescript
   export const pricingList = {
     basic: [
       {
         planTitle: "Basic Plan",
         price: 10,
         timeline: "monthly",
         link: "https://buy.stripe.com/test_basic_plan",
         priceId: "price_1Hh1Y2E2eZvKYlo2C1",
         description: "Basic plan description",
         features: [
           { isActive: true, label: "Build Links" },
           { isActive: true, label: "Over 66 complex" },
           { isActive: false, label: "24/7 Contact support" },
           { isActive: false, label: "Build Tools easily" },
           { isActive: false, label: "6TB storage" },
         ],
         products: [
           { name: "Product 1", quota: 10 },
           { name: "Product 2", quota: 20 },
         ],
       },
     ],
     // Add more plans as needed
   };
   ```

3. run yarn createProduct to populate the database

## Deployment

For deployment, ensure that you configure the production database and environment variables accordingly. More details about deployment can be found in the deployment section of the Next.js documentation.

## Contributing

We welcome contributions to this project! Please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Hire Me

Are you looking for a developer to bring your next project to life or enhance your team? I specialize in full-stack development and am eager to help make your vision a reality. Let's connect! Contact me at [meirankri@gmail.com](mailto:meirankri+saasboilerplate@gmail.com) for consultancy or potential collaborations.

2. **Database Schema**

   The boilerplate includes a Document model in the Prisma schema for tracking uploaded files:

   ```prisma
   model Document {
     id          String   @id @default(uuid())
     fileName    String
     fileUrl     String
     fileSize    Int
     mimeType    String
     entityId    String
     entityType  String
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     createdBy   String

     @@index([entityId, entityType])
     @@index([createdBy])
   }
   ```

3. **Using the Upload Component**

   The FileUpload component is ready to use in your pages:

   ```typescript
   import { FileUploadWrapper } from "@/components/FileUpload/FileUploadWrapper";

   // In your component:
   <FileUploadWrapper
     entityId="your-entity-id"
     entityType="your-entity-type"
   />;
   ```

4. **Features Included**

   - Drag and drop file upload
   - File size validation
   - Secure file storage in Cloudflare R2
   - File deletion
   - Signed URLs for secure file access
   - Progress tracking and error handling
   - i18n support for all messages
   - TypeScript support

5. **Security Considerations**

   - Files are stored with unique names to prevent collisions
   - Access is controlled through signed URLs
   - File size limits are enforced both client and server-side
   - Only authenticated users can upload and access files
   - Files are organized by entity type and ID for better organization
