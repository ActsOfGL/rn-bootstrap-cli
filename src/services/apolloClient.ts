import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { API_ENDPOINTS } from '@/constants';
import { useAuthStore } from '@/store';

// HTTP Link
const httpLink = createHttpLink({
    uri: API_ENDPOINTS.GRAPHQL_ENDPOINT,
});

// Auth Link
const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token;
    
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
        });
    }

    if (networkError) {
        console.error(`Network error: ${networkError}`);
        
        // Handle specific network errors
        if ('statusCode' in networkError && networkError.statusCode === 401) {
            // Token expired, logout user
            useAuthStore.getState().logout();
        }
    }
});

// Apollo Client
export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    // Add pagination policies here
                    listItems: {
                        keyArgs: false,
                        merge(existing = [], incoming) {
                            return [...existing, ...incoming];
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    },
});

// GraphQL Queries and Mutations
export const GET_LIST_ITEMS = `
    query GetListItems($page: Int, $limit: Int) {
        listItems(page: $page, limit: $limit) {
            id
            title
            description
            imageUrl
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_LIST_ITEM = `
    mutation CreateListItem($input: CreateListItemInput!) {
        createListItem(input: $input) {
            id
            title
            description
            imageUrl
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_LIST_ITEM = `
    mutation UpdateListItem($id: ID!, $input: UpdateListItemInput!) {
        updateListItem(id: $id, input: $input) {
            id
            title
            description
            imageUrl
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_LIST_ITEM = `
    mutation DeleteListItem($id: ID!) {
        deleteListItem(id: $id) {
            success
            message
        }
    }
`;

export const LOGIN_MUTATION = `
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                email
                name
                avatar
            }
            token
        }
    }
`;

export const REGISTER_MUTATION = `
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            user {
                id
                email
                name
                avatar
            }
            token
        }
    }
`;