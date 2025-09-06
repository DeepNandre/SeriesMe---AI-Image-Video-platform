/**
 * Example Netlify Function with Clerk authentication
 * 
 * This demonstrates how to protect Netlify Functions with Clerk authentication
 * when AUTH_ENABLED=true and users need server-side features.
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Future implementation when needed
// import { getAuth } from '@clerk/backend';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: ''
    };
  }

  try {
    // ✅ FUTURE: Uncomment when you need authenticated functions
    // 
    // const { userId } = getAuth(event);
    // if (!userId) {
    //   return {
    //     statusCode: 401,
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ error: 'Unauthorized - please sign in' })
    //   };
    // }

    // Example protected functionality
    const response = {
      message: 'This would be a protected endpoint',
      timestamp: new Date().toISOString(),
      // userId, // Would include user ID when auth is implemented
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};