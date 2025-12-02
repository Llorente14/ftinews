"use client";

import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";

import { useArticles } from "../../../hooks/useArticles";

// Impor CSS kustom
import "./cari.css";

type ArticleListItem = {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    category: string | null;
    publishedAt: string;
};

function ArticleResultItem({ article }: { article: ArticleListItem }) {
    const imageSrc = article.imageUrl || "/images/placeholder-globe.png";
    const category = article.category || "General";

    return (
        <Link href={`/artikel/${article.slug}`} passHref className="article-item-link">
            <div className="article-item">
                <Row className="g-4 align-items-center">
                    {/* Bagian Teks */}
                    <Col xs={12} sm>
                        <Stack gap={2}>
                            <div className="article-meta">
                                {category} <span className="text-muted mx-1">•</span> {article.publishedAt}
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
                                src={imageSrc}
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
    const [page, setPage] = useState(1);

    const { articles, meta, fetchArticles, isLoading, error } = useArticles();

    useEffect(() => {
        // Fetch initial articles on mount with default search term & page
        fetchArticles({ page: 1, search: searchTerm }).catch(() => {
            // error state is already handled in hook
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPage = 1;
        setPage(newPage);
        fetchArticles({ page: newPage, search: searchTerm }).catch(() => {
            // error state is already handled in hook
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        const newPage = 1;
        setPage(newPage);
        fetchArticles({ page: newPage, search: "" }).catch(() => {
            // error state is already handled in hook
        });
    };

    const renderPagination = () => {
        const currentPage = meta?.page ?? page;
        const totalPages = meta?.totalPages ?? 1;

        if (!meta || totalPages <= 1) {
            return null;
        }

        const canGoPrev = meta.hasPrevPage && currentPage > 1;
        const canGoNext = meta.hasNextPage && currentPage < totalPages;

        const handlePageChange = (newPage: number) => {
            if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
            setPage(newPage);
            fetchArticles({ page: newPage, search: searchTerm }).catch(() => {
                // error state is already handled in hook
            });
        };

        const renderPageNumbers = () => {
            const buttons: React.ReactNode[] = [];

            if (totalPages <= 5) {
                for (let p = 1; p <= totalPages; p++) {
                    buttons.push(
                        <button
                            key={p}
                            className={`pagination-button pagination-number-button ${p === currentPage ? "active" : ""}`}
                            onClick={() => handlePageChange(p)}
                        >
                            {p}
                        </button>
                    );
                }
            } else {
                const pagesToShow = [1, 2, 3, totalPages];

                pagesToShow.forEach((p, idx) => {
                    if (idx === 3) {
                        buttons.push(
                            <span key="ellipsis" className="pagination-ellipsis">
                                ...
                            </span>
                        );
                    }

                    buttons.push(
                        <button
                            key={p}
                            className={`pagination-button pagination-number-button ${p === currentPage ? "active" : ""}`}
                            onClick={() => handlePageChange(p)}
                        >
                            {p}
                        </button>
                    );
                });
            }

            return buttons;
        };

        return (
            <nav className="pagination-nav">
                <Button
                    variant="link"
                    className="pagination-button"
                    disabled={!canGoPrev}
                    onClick={() => canGoPrev && handlePageChange(currentPage - 1)}
                >
                    <span className="material-symbols-outlined pagination-arrow">arrow_back</span>
                    Prev
                </Button>

                {renderPageNumbers()}

                <Button
                    variant="link"
                    className="pagination-button"
                    disabled={!canGoNext}
                    onClick={() => canGoNext && handlePageChange(currentPage + 1)}
                >
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
                                    {meta
                                        ? `Showing ${meta.total} results found`
                                        : isLoading
                                            ? "Loading results..."
                                            : "Showing 0 results found"}
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
                                {isLoading && (
                                    <p className="text-muted">Loading articles...</p>
                                )}

                                {!isLoading && error && (
                                    <p className="text-danger">Terjadi kesalahan: {error}</p>
                                )}

                                {!isLoading && !error && articles.length === 0 && (
                                    <p className="text-muted">
                                        Tidak ada hasil untuk &quot;{searchTerm}&quot;
                                    </p>
                                )}

                                {!isLoading && !error && articles.length > 0 && (
                                    <Stack gap={3}>
                                        {articles.map((article) => (
                                            <ArticleResultItem
                                                key={article.id}
                                                article={{
                                                    id: article.id,
                                                    slug: article.slug,
                                                    title: article.title,
                                                    description: article.description,
                                                    imageUrl: article.imageUrl,
                                                    category: article.category,
                                                    publishedAt: article.publishedAt,
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
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