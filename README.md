# AI Food Tracker

This project is an AI-powered workflow designed to retrieve nutritional values for ingredients. It interacts with users to validate their input, translates the ingredient names to English, and queries the FoodData Central API from the USDA to fetch detailed nutritional information.

## Features

- **Ingredient Validation**: Ensures the user-provided input is a valid ingredient.
- **Translation**: Translates ingredient names to English for better API compatibility.
- **Nutritional Data Retrieval**: Fetches detailed nutritional information from the FoodData Central API.
- **Interactive Workflow**: Guides users through a conversational interface to refine their input and provide accurate results.
- **Pluggable AI Client**: Uses Ollama, a local AI service, for processing. Other AI clients can be implemented by adhering to the client interface.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **TypeScript**: Ensures type safety and better developer experience.
- **Vite**: Development environment for fast builds and hot module replacement.
- **Tailwind CSS**: For styling the application.
- **i18next**: Handles internationalization.
- **FoodData Central API**: Provides nutritional data for ingredients.
- **Ollama**: Local AI service for processing user input and workflow tasks.

## How It Works

1. **User Input**: The user writes an ingredient.
2. **Validation**: The system checks if the input is a valid ingredient.
3. **Translation**: If valid, the ingredient name is translated to English.
4. **API Query**: The translated name is used to query the FoodData Central API.
5. **API Response Evaluation**: The system evaluates the API response to identify and select the most accurate match for the ingredient.
6. **Nutritional Data Presentation**: The system processes the API response for the selected ingredient and presents the nutritional information to the user.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-food-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Copy `.env.example` to `.env`.
   - Add your FoodData Central API key to the `VITE_APP_FDC_API_KEY` variable.

4. Ensure Ollama is running:
   - Start the Ollama service locally. Refer to the Ollama documentation for setup instructions.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open the application in your browser at `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Folder Structure

- `src/components`: Contains React components for the UI.
- `src/services`: Includes AI workflows and API interaction logic.
- `src/types.ts`: Defines TypeScript types used across the project.
- `locales`: Stores translation files for internationalization.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and concise messages.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
