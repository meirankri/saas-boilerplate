# SaaS Boilerplate Project

Welcome to our SaaS Boilerplate Project, an all-in-one starter kit designed to jumpstart your next SaaS application. This boilerplate is built on Next.js using the new App Router, integrated with a variety of authentication methods and powerful backend technologies to provide a robust foundation for scaling your application.

## Features

- **Authentication**: Seamless authentication setup using Lucia-auth with support for Magic Link, Google, Facebook, and GitHub sign-ins.
- **Payments**: Integrated with Stripe for handling subscription-based models. Multiple subscription plans are supported to cater to a diverse customer base.
- **Database**: Utilizes Drizzle ORM with PostgreSQL, ensuring efficient data handling and scalability.
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

   ```bash
   npm run push
   ```

5. **Run the development server**

   Start the server with:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser to see the application in action.

## Deployment

For deployment, ensure that you configure the production database and environment variables accordingly. More details about deployment can be found in the deployment section of the Next.js documentation.

## Contributing

We welcome contributions to this project! Please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
