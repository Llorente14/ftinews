'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Container,
    Row,
    Col,
    Form,
    InputGroup,
    Button,
    Stack,
} from 'react-bootstrap';

// Impor CSS kustom
import './cari.css';

type StaticArticle = {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    publishedAt: string;
};

const staticArticles: StaticArticle[] = [
    {
        id: '1',
        slug: 'global-summit-addresses-climate-change',
        title: 'Global Summit Addresses Climate Change',
        description: 'Leaders from around the world gathered to discuss urgent measures to combat the growing climate crisis.',
        imageUrl: '/images/placeholder-globe.png',
        category: 'World',
        publishedAt: 'Oct 26, 2023',
    },
    {
        id: '2',
        slug: 'new-healthcare-bill-passes-senate',
        title: 'New Healthcare Bill Passes Senate',
        description: 'A landmark healthcare bill narrowly passed the Senate after weeks of heated debate. The legislation aims to expand coverage.',
        imageUrl: '/images/placeholder-senate.png',
        category: 'National',
        publishedAt: 'Oct 25, 2023',
    },
    {
        id: '3',
        slug: 'economic-policy-shifts-focus',
        title: 'Economic Policy Shifts Focus to Inflation Control',
        description: 'Facing rising inflation, central banks are adjusting their economic policies. The move is expected to impact interest rates.',
        imageUrl: '/images/placeholder-economy.png',
        category: 'Economy',
        publishedAt: 'Oct 24, 2023',
    },
];

function ArticleResultItem({ article }: { article: StaticArticle }) {
    return (
        <Link href={`/artikel/${article.slug}`} passHref className="article-item-link">
            <div className="article-item">
                <Row className="g-4 align-items-center">
                    {/* Bagian Teks */}
                    <Col xs={12} sm>
                        <Stack gap={2}>
                            <div className="article-meta">
                                {article.category} <span className="text-muted mx-1">•</span> {article.publishedAt}
                            </div>
                            <h5 className="article-title">{article.title}</h5>
                            <p className="article-description d-none d-sm-block">
                                {article.description}
                            </p>
                        </Stack>
                    </Col>

                    {/* Bagian Gambar */}
                    <Col xs={12} sm="auto">
                        <div className="article-image-wrapper">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={208}
                                height={144}
                                className="article-image"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Link>
    );
}

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("Politics");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Mencari untuk: ${searchTerm}`);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const renderPagination = () => {
        return (
            <nav className="pagination-nav">
                <Button variant="link" className="pagination-button" disabled>
                    <span className="material-symbols-outlined pagination-arrow">arrow_back</span>
                    Prev
                </Button>

                <button className="pagination-button pagination-number-button active">1</button>
                <button className="pagination-button pagination-number-button">2</button>
                <button className="pagination-button pagination-number-button">3</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-button pagination-number-button">8</button>

                <Button variant="link" className="pagination-button">
                    Next
                    <span className="material-symbols-outlined pagination-arrow">arrow_forward</span>
                </Button>
            </nav>
        );
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col lg={9} xl={8}>
                        <Stack gap={5}>

                            {/* --- Header Section (Judul & Search) --- */}
                            <div className="search-container">
                                <h1 className="h3 fw-bolder mb-1 text-dark">
                                    Search results for: <span className="text-primary">"{searchTerm}"</span>
                                </h1>
                                <p className="text-muted mb-4">
                                    Showing 12 results found
                                </p>

                                <Form onSubmit={handleSubmit}>
                                    <InputGroup className="search-input-group">
                                        <InputGroup.Text className="search-icon">
                                            <span className="material-symbols-outlined">search</span>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="search"
                                            placeholder="Search articles, topics, or authors..."
                                            className="search-input"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <Button variant="link" className="search-clear-btn" onClick={handleClearSearch}>
                                                <span className="material-symbols-outlined">cancel</span>
                                            </Button>
                                        )}
                                    </InputGroup>
                                </Form>
                            </div>

                            {/* --- Konten List Artikel --- */}
                            <div>
                                <Stack gap={3}>
                                    {staticArticles.map((article) => (
                                        <ArticleResultItem key={article.id} article={article} />
                                    ))}
                                </Stack>
                            </div>

                            {/* --- Pagination --- */}
                            <div>
                                {renderPagination()}
                            </div>
                        </Stack>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SearchPage;