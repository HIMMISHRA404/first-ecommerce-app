# ShopEasy E-Commerce Application

A modern e-commerce web application built with plain HTML, Tailwind CSS, and vanilla JavaScript. This application fetches product data from the FakeStore API and provides a complete shopping experience with responsive design for all device sizes.

## Features

- **Product Browsing**: View all products with pagination
- **Product Categories**: Filter products by categories
- **Product Search**: Search for products by name, description, or category
- **Product Sorting**: Sort products by price or name
- **Product Details**: View detailed product information in a modal
- **Shopping Cart**: Add, remove, and update quantities of products
- **Checkout Process**: Complete checkout with shipping and payment information
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Local Storage**: Cart data persists between sessions
- **Touch-Friendly**: Mobile-optimized interactions including swipe gestures

## Technologies Used

- **HTML5**: For structure and content
- **Tailwind CSS**: For styling and responsive design
- **JavaScript**: For interactivity and functionality
- **FakeStore API**: For product data
- **Font Awesome**: For icons
- **LocalStorage API**: For cart persistence

## How to Run

1. Clone this repository
2. Open the `index.html` file in your web browser

Alternatively, you can use a local development server:

```bash
# Using Python
python -m http.server

# Using Node.js (with http-server package)
npx http-server
```

## Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── app.js          # JavaScript functionality
├── vercel.json         # Vercel deployment configuration
└── README.md           # Project documentation
```

## Deployment

### Deploying to Vercel

This project includes a `vercel.json` configuration file for easy deployment to [Vercel](https://vercel.com/).

To deploy to Vercel:

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Deploy from the project directory:
   ```bash
   vercel
   ```

Alternatively, you can deploy directly from GitHub:

1. Push your code to a GitHub repository
2. Import the repository in the Vercel dashboard
3. Vercel will automatically detect the configuration and deploy your site

The included `vercel.json` file configures:
- Static file handling for HTML, CSS, and JavaScript
- Proper routing for the application
- Cache headers for optimal performance
- Security headers for better protection

### Custom Domain

After deploying to Vercel, you can add a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the instructions to configure DNS

## API Integration

This application uses the [FakeStore API](https://fakestoreapi.com/) to fetch product data. The API provides product information including:

- Title
- Price
- Description
- Category
- Image
- Rating

## Features in Detail

### Product Browsing

- Featured products section
- All products section with pagination
- "Load More" functionality to see additional products

### Product Filtering

- Filter products by categories:
  - Electronics
  - Jewelry
  - Men's Clothing
  - Women's Clothing

### Shopping Cart

- Add products to cart
- Update product quantities
- Remove products from cart
- View cart total
- Persistent cart using localStorage

### Checkout Process

- Enter shipping information
- Enter payment details
- Order confirmation

### Responsive Design

- **Mobile-First Approach**: Optimized for small screens with appropriate scaling
- **Flexible Layouts**: Using Tailwind's responsive classes for different screen sizes
- **Touch-Friendly UI**: Larger touch targets on mobile devices
- **Swipe Gestures**: Swipe to close cart on mobile devices
- **Responsive Typography**: Text sizes adjust based on screen size
- **Optimized Images**: Image sizes and layouts adapt to screen dimensions
- **Responsive Navigation**: Mobile-friendly navigation with appropriate spacing
- **Modal Adaptations**: Modals and overlays properly sized for all devices

## Future Enhancements

- User authentication
- Product reviews
- Wishlist functionality
- Order history
- Payment gateway integration
- Advanced filtering options
- Dark mode support

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [FakeStore API](https://fakestoreapi.com/) for providing product data
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Font Awesome](https://fontawesome.com/) for the icons
- [Vercel](https://vercel.com/) for hosting and deployment 