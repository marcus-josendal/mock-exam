const React = require('react');
const {mount} = require('enzyme');
const {BrowserRouter} = require('react-router-dom');

const {Home} = require('../../src/client/views/home');

describe("Testing the Home component", () => {
    it("Should test for home text", () => {
        const driver = mount(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const html = driver.html();
        expect(html.includes("Hello")).toBe(true)
    })
});
