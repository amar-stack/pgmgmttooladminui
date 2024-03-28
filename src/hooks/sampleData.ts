/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then((res) => res.json())
import axios from 'axios';

export const useSampleClients = () => {
  const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWQ3MzU2MDUyYTcyZTY1NmU1NjdhMDciLCJpYXQiOjE3MDkxMzY4MTcsImV4cCI6MTcwOTEzODYxNywidHlwZSI6ImFjY2VzcyJ9.ENvVh9cgMjvuNKHBfAM-kIuWl-Pa3bhN1FBnIxVUjcI'; 
  axios.get("http://43.204.30.219:3000/v1/users")
  .then(response => {
      // If request is good...
      return {
        clients: response?.data?.results ?? []
      }
    })
  .catch((error) => {
    return {
      isError: error,
    }
    });

  
}

export const useSampleTransactions = () => {
  const { data, error } = useSWR('/admin-one-react-tailwind/data-sources/history.json', fetcher)

  return {
    transactions: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}
