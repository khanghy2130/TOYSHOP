import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom"


import Index from '~/routes/_index';

test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
});

test('loads and displays greeting', async () => {
    // ARRANGE
    render(<Index/>)
  
    // ACT
    await userEvent.click(screen.getByText('click here'))
    await screen.findByRole('heading')
  
    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent("done")
})