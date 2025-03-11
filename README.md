# 404lovefound

This repository contains the source code for [404found.love](https://404found.love), a service that transforms frustrating 404 "Not Found" errors into an opportunity by displaying adoptable pets from your area. Instead of showing a standard error page, why not give your users a chance to discover a pet in need of a home?

## Usage

To implement this on your website, simply redirect your 404 pages to:

```
https://404found.love?referer=<url>
```

The `referer` parameter is optional and will be used for the BACK button functionality:

- If provided in the URL, it will use that specific URL
- If not provided, it will attempt to use the HTTP referer header
- If neither is available, it will use `history.back()`

## Local Development Setup

The following instructions are only necessary if you want to run your own instance of the service locally or fork the project. If you just want to use the service on your website, refer to the Usage section above.

### API Key

This project uses the RescueGroups.org API. To run the application:

1. Get your API key from [RescueGroups.org API Service](https://rescuegroups.org/services/adoptable-pet-data-api/)
2. Create a `.env.local` file in the root directory
3. Add your API key:

```
RESCUEGROUPS_API_KEY=your_api_key_here
```

Please note: Never commit your `.env.local` file or share your API key publicly.
