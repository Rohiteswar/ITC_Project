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

export default function AdminDashboard() {
  const auth = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<{ title: string, author: string, Available: string }>({ title: '', author: '' , Available: ''});

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

  // Add a new book to DynamoDB
  const handleAddBook = async () => {
    if (newBook.title && newBook.author) {
      try {
        const params = {
          TableName: 'LibraryBooks',
          Item: {
            id: Date.now().toString(),
            title: newBook.title,
            author: newBook.author,
            Available: newBook.Available,
          },
        };
        await dynamoDB.put(params).promise();
        setBooks((prevBooks) => [...prevBooks, params.Item as Book]);
        setNewBook({ title: '', author: '' , Available:''});
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    auth.removeUser();
    router.push('/');
  };

  return (
    <div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome, Admin! Manage books, users, and other settings here.</p>
      <button style={styles.signOutButton} onClick={handleSignOut}>Sign Out</button>
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

    <div style={styles.formSection}>
      <h3 style={styles.formTitle}>Add New Book</h3>
      <div style={styles.formFields}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          style={styles.inputField}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          style={styles.inputField}
        />
        <input
          type="text"
          placeholder="Available"
          value={newBook.Available}
          onChange={(e) => setNewBook({ ...newBook, Available: e.target.value })}
          style={styles.inputField}
        />
      </div>
      <button style={styles.addBookButton} onClick={handleAddBook}>Add Book</button>
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
formSection: CSSProperties;
formTitle: CSSProperties;
formFields: CSSProperties;
inputField: CSSProperties;
addBookButton: CSSProperties;
} = {
container: {
  fontFamily: "Arial, sans-serif",
  margin: "0",
  padding: "20px",
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
},
header: {
  textAlign: "center",
  marginBottom: "40px",
  padding: "20px",
  backgroundColor: "#007BFF",
  color: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
  marginTop: "15px",
},
booksSection: {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "30px",
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
formSection: {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
},
formTitle: {
  fontSize: "1.5rem",
  marginBottom: "15px",
  color: "#333",
},
formFields: {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginBottom: "15px",
},
inputField: {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
},
addBookButton: {
  padding: "10px 20px",
  fontSize: "1rem",
  color: "#fff",
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
},
};
