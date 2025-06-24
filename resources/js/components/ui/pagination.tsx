import { router } from '@inertiajs/react';
import { Button } from './button';

interface PaginationProps {
    current_page: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number;
    to: number;
    total: number;
}

export default function Pagination({ pagination }: { pagination: PaginationProps }) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Menampilkan {pagination.from}–{pagination.to} dari {pagination.total} data
            </div>
            <div className="flex flex-wrap gap-1">
                {(() => {
                    const currentPage = pagination.current_page;
                    const lastPage = pagination.last_page;
                    const links = [];

                    links.push(
                        <Button
                            key="prev"
                            size="sm"
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => {
                                if (currentPage > 1) {
                                    const prevUrl = pagination.links.find(
                                        (link) => link.label.includes('Previous') || link.label.includes('&laquo;'),
                                    )?.url;
                                    if (prevUrl) {
                                        router.get(
                                            prevUrl,
                                            {},
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }
                                }
                            }}
                            className="mx-0.5"
                        >
                            « Previous
                        </Button>,
                    );

                    if (lastPage <= 3) {
                        for (let i = 1; i <= lastPage; i++) {
                            const pageLink = pagination.links.find((link) => Number(link.label) === i);
                            links.push(
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={i === currentPage ? 'default' : 'outline'}
                                    onClick={() => {
                                        if (pageLink?.url) {
                                            router.get(
                                                pageLink.url,
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            );
                                        }
                                    }}
                                    className="mx-0.5"
                                >
                                    {i}
                                </Button>,
                            );
                        }
                    } else {
                        const page1Link = pagination.links.find((link) => Number(link.label) === 1);
                        links.push(
                            <Button
                                key={1}
                                size="sm"
                                variant={1 === currentPage ? 'default' : 'outline'}
                                onClick={() => {
                                    if (page1Link?.url) {
                                        router.get(
                                            page1Link.url,
                                            {},
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }
                                }}
                                className="mx-0.5"
                            >
                                1
                            </Button>,
                        );

                        if (currentPage > 2) {
                            links.push(
                                <span key="ellipsis1" className="px-2 text-gray-400 select-none">
                                    ...
                                </span>,
                            );
                        }

                        const start = Math.max(2, currentPage);
                        const end = Math.min(lastPage - 1, currentPage);

                        for (let i = start; i <= end; i++) {
                            const pageLink = pagination.links.find((link) => Number(link.label) === i);
                            links.push(
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={i === currentPage ? 'default' : 'outline'}
                                    onClick={() => {
                                        if (pageLink?.url) {
                                            router.get(
                                                pageLink.url,
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            );
                                        }
                                    }}
                                    className="mx-0.5"
                                >
                                    {i}
                                </Button>,
                            );
                        }

                        if (currentPage < lastPage - 1) {
                            links.push(
                                <span key="ellipsis2" className="px-2 text-gray-400 select-none">
                                    ...
                                </span>,
                            );
                        }

                        if (lastPage > 1) {
                            const lastPageLink = pagination.links.find((link) => Number(link.label) === lastPage);
                            links.push(
                                <Button
                                    key={lastPage}
                                    size="sm"
                                    variant={lastPage === currentPage ? 'default' : 'outline'}
                                    onClick={() => {
                                        if (lastPageLink?.url) {
                                            router.get(
                                                lastPageLink.url,
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            );
                                        }
                                    }}
                                    className="mx-0.5"
                                >
                                    {lastPage}
                                </Button>,
                            );
                        }
                    }

                    links.push(
                        <Button
                            key="next"
                            size="sm"
                            variant="outline"
                            disabled={currentPage === lastPage}
                            onClick={() => {
                                if (currentPage < lastPage) {
                                    const nextUrl = pagination.links.find(
                                        (link) => link.label.includes('Next') || link.label.includes('&raquo;'),
                                    )?.url;
                                    if (nextUrl) {
                                        router.get(
                                            nextUrl,
                                            {},
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }
                                }
                            }}
                            className="mx-0.5"
                        >
                            Next »
                        </Button>,
                    );

                    return links;
                })()}
            </div>
        </div>
    );
}
