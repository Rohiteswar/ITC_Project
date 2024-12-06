'use client';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import AWS from 'aws-sdk';

// Initialize DynamoDB DocumentClient with client-side configurations
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: 'AKIAQCXMY3G32MCPEKMK',
  secretAccessKey: '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'
});

interface Book {
  id: string;
  title: string;
  author: string;
  Available: string;
  // Add any other properties based on your data structure
}

export default function UserDashboard() {

  const auth = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

  // Fetch books from DynamoDB on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = {
          TableName: 'LibraryBooks', // Replace with your DynamoDB table name
        };

        const data = await dynamoDB.scan(params).promise();
        setBooks(data.Items as Book[] || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSignOut = () => {
    auth.removeUser();
    router.push('/');
  };

  return (
    <div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>User Dashboard</h1>
      <p style={styles.subtitle}>
        Welcome! Explore books and manage your library account here.
      </p>
      <button style={styles.signOutButton} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>

    <div style={styles.booksSection}>
        <h2 style={styles.booksTitle}>Library Books</h2>
        <ul style={styles.bookList}>
          {books.map((book) => (
            <li key={book.id} style={styles.bookItem}>
              <div style={styles.bookDetails}>
                <div style={styles.bookRow}>
                  <strong>Title:</strong> <span>{book.title}</span>
                </div>
                <div style={styles.bookRow}>
                  <strong>Author:</strong> <span>{book.author}</span>
                </div>
                <div style={styles.bookRow}>
                  <strong>Available:</strong> <span>{book.Available}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles: {
  container: CSSProperties;
  header: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  signOutButton: CSSProperties;
  booksSection: CSSProperties;
  booksTitle: CSSProperties;
  bookList: CSSProperties;
  bookItem: CSSProperties;
  bookDetails: CSSProperties;
  bookRow: CSSProperties;
} = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2.5rem",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "1.2rem",
    margin: "0 0 20px 0",
  },
  signOutButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#007BFF",
    backgroundColor: "#fff",
    border: "2px solid #007BFF",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  booksSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  booksTitle: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  bookList: {
    listStyleType: "none",
    padding: "0",
  },
  bookItem: {
    padding: "15px 20px",
    marginBottom: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  bookDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bookRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
  },
};
