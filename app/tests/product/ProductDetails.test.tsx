import { describe, it, expect, vi, Mock, assert } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductDetails from "~/routes/product.$productID/ProductDetails";
import { useOutletContext } from "@remix-run/react";

vi.mock("@remix-run/react", () => ({
    useOutletContext: vi.fn(),
    useNavigate: vi.fn(),
    Form: ({
        children,
        onSubmit,
    }: {
        children: React.ReactNode;
        onSubmit?: () => void;
    }) => <form onSubmit={onSubmit}>{children}</form>,
}));

const mockUseOutletContext = {
    user: { id: "abc" },
    rawCartItems: [],
    setRawCartItems: vi.fn(),
    addNotification: vi.fn(),
    supabase: {
        from: () => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    eq: vi.fn(() =>
                        Promise.resolve({
                            data: [{ id: 1, name: "item1" }],
                            error: null,
                        }),
                    ),
                })),
            })),
        }),
    },
};

describe("Product page details section", () => {
    it("disables 'Add to cart' button if out of stock", async () => {
        (useOutletContext as Mock).mockReturnValue(mockUseOutletContext);

        const result = render(
            <ProductDetails
                productInfo={{
                    id: 123,
                    title: "test-title",
                    description: "desc",
                    quantity: 0,

                    average_rating: 0,
                    discount: 0,
                    price: 100,
                    price_with_discount: 100,

                    tags: ["tag1", "tag2"],
                    imgNames: ["img1"],
                }}
            />,
        );
        await waitFor(() => {
            const addToCartButton = screen.getByTestId("add-to-cart-button");
            expect(addToCartButton).toBeDisabled();
        });
    });

    it("enable 'Add to cart' button if in stock", async () => {
        (useOutletContext as Mock).mockReturnValue(mockUseOutletContext);

        const result = render(
            <ProductDetails
                productInfo={{
                    id: 123,
                    title: "test-title",
                    description: "desc",
                    quantity: 15,

                    average_rating: 0,
                    discount: 0,
                    price: 100,
                    price_with_discount: 100,

                    tags: ["tag1", "tag2"],
                    imgNames: ["img1"],
                }}
            />,
        );
        await waitFor(() => {
            const addToCartButton = screen.getByTestId("add-to-cart-button");
            expect(addToCartButton).toBeEnabled();
        });
    });
});
