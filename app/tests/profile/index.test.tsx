import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Profile from "../../routes/profile/index";
import {
    useLoaderData,
    useOutletContext,
    useSearchParams,
} from "@remix-run/react";

vi.mock("@remix-run/react", () => ({
    useOutletContext: vi.fn(),
    useLoaderData: vi.fn(),
    useSearchParams: vi.fn(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
        <a href={to}>{children}</a>
    ),
    Form: ({
        children,
        onSubmit,
    }: {
        children: React.ReactNode;
        onSubmit?: () => void;
    }) => <form onSubmit={onSubmit}>{children}</form>,
}));

describe("Profile page", () => {
    it("renders Login button if unauthenticated", () => {
        (useOutletContext as Mock).mockReturnValue({
            user: null,
        });
        (useLoaderData as Mock).mockReturnValue(null);

        render(<Profile />);

        const loginButton = screen.getByRole("button", {
            name: /Login/i,
        });
        expect(loginButton).toBeInTheDocument();
    });

    it("renders 'My orders' heading if authenticated", () => {
        (useOutletContext as Mock).mockReturnValue({
            user: { id: "abc" },
            env: { SUPABASE_IMAGES_PATH: "path" },
            supabase: {
                from: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        order: vi.fn().mockReturnValue({
                            eq: vi.fn().mockResolvedValue({
                                data: [{ id: 1 }, { id: 2 }],
                            }),
                        }),
                        eq: vi.fn().mockResolvedValue({
                            data: [{ id: 1 }, { id: 2 }],
                        }),
                    }),
                }),
                storage: {
                    from: () => ({
                        list: vi.fn().mockResolvedValue({
                            data: [{ name: "1" }],
                        }),
                    }),
                },
            },
            setUserDisplayName: vi.fn(),
            setWishlist: vi.fn(),
        });
        (useLoaderData as Mock).mockReturnValue({
            newWishlist: [1, 2],
            orderedProducts: [{ id: 1 }, { id: 2 }],
            ordersData: [{ id: 1 }, { id: 2 }],
        });
        (useSearchParams as Mock).mockReturnValue([{ get: vi.fn() }]);

        render(<Profile />);

        const myOrdersHeading = screen.getByRole("heading", {
            name: /My orders/i,
        });
        expect(myOrdersHeading).toBeInTheDocument();
    });
});
