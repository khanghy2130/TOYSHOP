import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

// import Index from "../routes/_index";

describe("App", () => {
    it("dummy test", async () => {
        /*
        // ARRANGE
        render(<Index />);

        // ACT
        await userEvent.click(screen.getByText("click here"));
        await screen.findByRole("heading");

        // ASSERT
        expect(screen.getByRole("heading")).toHaveTextContent("done");
        */

        expect(1 + 2).toBe(3);
    });
});
