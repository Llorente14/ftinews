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

// Impor CSS kustom untuk halaman ini
import './cari.css';

// --- Tipe Data Statis (Pengganti Tipe dari Hook) ---
type StaticArticle = {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    publishedAt: string;
};

// --- Data Hardcode ---
const staticArticles: StaticArticle[] = [
    {
        id: '1',
        slug: 'global-summit-addresses-climate-change',
        title: 'Global Summit Addresses Climate Change',
        description: 'Leaders from around the world gathered to discuss urgent measures to combat the growing climate crisis. The summit aims to set new, ambitious targets for reducing carbon emissions.',
        imageUrl: '/images/placeholder-globe.png', // Ganti dengan path gambar Anda
        category: 'World',
        publishedAt: 'Oct 26, 2023',
    },
    {
        id: '2',
        slug: 'new-healthcare-bill-passes-senate',
        title: 'New Healthcare Bill Passes Senate',
        description: 'A landmark healthcare bill narrowly passed the Senate after weeks of heated debate. The legislation aims to expand coverage and lower prescription drug costs for millions.',
        imageUrl: '/images/placeholder-senate.png', // Ganti dengan path gambar Anda
        category: 'National',
        publishedAt: 'Oct 25, 2023',
    },
    {
        id: '3',
        slug: 'economic-policy-shifts-focus',
        title: 'Economic Policy Shifts Focus to Inflation Control',
        description: 'Facing rising inflation, central banks are adjusting their economic policies. The move is expected to impact interest rates and investment strategies across the board.',
        imageUrl: '/images/placeholder-economy.png', // Ganti dengan path gambar Anda
        category: 'Economy',
        publishedAt: 'Oct 24, 2023',
    },
];


// --- Komponen Internal untuk List Artikel ---
function ArticleResultItem({ article }: { article: StaticArticle }) {
    return (
        <Link href={`/artikel/${article.slug}`} passHref className="article-item-link">
            <div className="article-item">
                <Row className="g-3 align-items-start">
                    {/* Bagian Teks */}
                    <Col>
                        <Stack gap={1}>
                            <p className="article-meta mb-0">
                                {article.publishedAt} • {article.category}
                            </p>
                            <h5 className="article-title mb-0">{article.title}</h5>
                            <p className="article-description d-none d-sm-block">
                                {article.description}
                            </p>
                        </Stack>
                    </Col>

                    {/* Bagian Gambar */}
                    <Col xs="auto" sm={4} md={3} lg={3}>
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={192} // sm:w-48
                            height={128} // h-32
                            className="article-image"
                        />
                    </Col>
                </Row>
            </div>
        </Link>
    );
}

// --- Komponen Utama Halaman Pencarian ---
function SearchPage() {
    // State hanya untuk mengontrol input search bar
    const [searchTerm, setSearchTerm] = useState("Politics");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logika pencarian akan ditambahkan di sini nanti
        alert(`Mencari untuk: ${searchTerm}`);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Render pagination statis sesuai desain HTML
    const renderPagination = () => {
        return (
            <nav className="pagination-nav">
                {/* Tombol Previous */}
                <Button
                    variant="link"
                    className="pagination-button"
                    disabled={true} // Halaman 1, jadi disable
                >
                    <span className="material-symbols-outlined pagination-arrow">arrow_back</span>
                    Previous
                </Button>

                {/* Tombol Angka (DITAMBAHKAN CLASS 'pagination-number-button') */}
                <button className="pagination-button pagination-number-button active">1</button>
                <button className="pagination-button pagination-number-button">2</button>
                <button className="pagination-button pagination-number-button">3</button>

                <span className="pagination-ellipsis">...</span>

                <button className="pagination-button pagination-number-button">8</button>

                {/* Tombol Next */}
                <Button
                    variant="link"
                    className="pagination-button"
                    disabled={false} // Asumsi ada halaman berikutnya
                >
                    Next
                    <span className="material-symbols-outlined pagination-arrow">arrow_forward</span>
                </Button>
            </nav>
        );
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={9} xl={8}>
                    <Stack gap={4}>
                        {/* --- Judul Hasil Pencarian --- */}
                        <div>
                            <h1 className="h3 fw-bolder">
                                Search results for: "Politics"
                            </h1>
                            <p className="text-muted">
                                Showing 12 results
                            </p>
                        </div>

                        {/* --- Search Bar --- */}
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="search-input-group">
                                <InputGroup.Text className="search-icon">
                                    <span className="material-symbols-outlined">search</span>
                                </InputGroup.Text>
                                <Form.Control
                                    type="search"
                                    placeholder="Search articles..."
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

                        {/* --- Konten (List Statis) --- */}
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
    );
}

export default SearchPage;