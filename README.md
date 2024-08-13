# SaaS Boilerplate Project

Welcome to our SaaS Boilerplate Project, an all-in-one starter kit designed to jumpstart your next SaaS application. This boilerplate is built on Next.js using the new App Router, integrated with a variety of authentication methods and powerful backend technologies to provide a robust foundation for scaling your application.

## Features

- **Authentication**: Seamless authentication setup using Lucia-auth with support for Magic Link, Google, Facebook, and GitHub sign-ins.
- **Payments**: Integrated with Stripe for handling subscription-based models. Multiple subscription plans are supported to cater to a diverse customer base.
- **Database**: Utilizes prisma ORM with PostgreSQL, ensuring efficient data handling and scalability.
- **Emails**: Integrated email functionality with Nodemailer for reliable transactional email delivery.
- **Styling**: Styled with Tailwind CSS for rapid UI development without sacrificing design quality.

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
   ``

2. **Install dependencies**

   ```bash
   npm install || yarn 
   ```

3. **Environment setup**

   Copy the .env.exemple to .env update it with your credentials:


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
           { name: "Product 1", quota:10 },
           { name: "Product 2" , quota: 20},
         ],
       },
     ],
     // Add more plans as needed
   };

3. run yarn seed to populate the database

## Deployment

For deployment, ensure that you configure the production database and environment variables accordingly. More details about deployment can be found in the deployment section of the Next.js documentation.

## Contributing

We welcome contributions to this project! Please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Hire Me

Are you looking for a developer to bring your next project to life or enhance your team? I specialize in full-stack development and am eager to help make your vision a reality. Let's connect! Contact me at [meirankri@gmail.com](mailto:meirankri+saasboilerplate@gmail.com) for consultancy or potential collaborations.
