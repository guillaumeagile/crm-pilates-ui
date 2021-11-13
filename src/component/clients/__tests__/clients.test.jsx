import React from "react";
import {Clients} from "../ClientPage";
import {prettyDOM, screen, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import {render} from "../../../test-utils/test-utils";
import {client, ClientsBuilder} from "../../../test-utils/clients/clients";
import {APIDetail, APIErrorBody, ServerBuilder} from "../../../test-utils/server/server";


describe('ClientPage page', function () {
    const server = new ServerBuilder().request("/clients", "get", []).build()

    beforeAll(() => server.listen())

    afterEach(() => server.resetHandlers())

    afterAll(() => server.close())

    it('should be displayed', () => {
        const {container} = render(<Clients/>)

        expect(prettyDOM(container)).toMatchSnapshot()
    })

    describe('fetches clients when loading', function () {
        describe("retrieve them", () => {
            const server = new ServerBuilder()
                .request("/clients", "get", new ClientsBuilder()
                    .withClient(client())
                    .withClient(client("Pierre", "Martin", "33da6f24-efda-4c16-b8af-e5e822fc5860"))
                    .withClient(client("Henri", "Verneuil", "33da6bca-efda-4c16-b8af-e5e822fc5901"))
                    .build())
                .build()

            beforeAll(() => server.listen())

            afterEach(() => server.resetHandlers())

            afterAll(() => server.close())

            it('and should display them', async () => {
                render(<Clients/>)

                expect(await screen.findByText("Doe", {selector: 'h6'})).toBeInTheDocument()
                expect(await screen.findByText("John")).toBeInTheDocument()
                expect(await screen.findByText("Martin", {selector: 'h6'})).toBeInTheDocument()
                expect(await screen.findByText("Pierre")).toBeInTheDocument()
                expect(await screen.findByText("Verneuil", {selector: 'h6'})).toBeInTheDocument()
                expect(await screen.findByText("Henri")).toBeInTheDocument()
            })
        })

        describe("faces an error", () => {
            const server = new ServerBuilder().request("/clients", "get", new APIErrorBody()
                .dummyDetail()
                .build(), 422)
                .build()

            beforeAll(() => server.listen())

            afterEach(() => server.resetHandlers())

            afterAll(() => server.close())

            it("and should display it", async () => {
                render(<Clients/>)

                expect(await screen.findByText("An error occurred (see message below):", {selector: 'h5'})).toBeInTheDocument()
                expect(await screen.findByText("an error message", {selector: 'p'})).toBeInTheDocument()
                expect(await screen.findByText("an error type", {selector: 'p'})).toBeInTheDocument()
            })
        })

    })

    describe('displays a form to create a client', function () {
        const server = new ServerBuilder()
            .request("/clients", "get", [])
            .request("/clients", "post", client())
            .build()

        beforeAll(() => server.listen())

        afterEach(() => server.resetHandlers())

        afterAll(() => server.close())

        it('and should create John Doe', async () => {
            render(<Clients/>)

            userEvent.click(screen.getByRole("button", {name: /add a new client/i}))
            userEvent.type(screen.getByText("Client's name"), "Doe")
            userEvent.type(screen.getByText("Client's firstname"), "John")
            userEvent.click(screen.getByRole("button", {name: /submit/i}))

            expect(await screen.findByText("Doe", {selector: 'h6'})).toBeInTheDocument()
            expect(await screen.findByText("John", )).toBeInTheDocument()
            await waitFor(() => expect(screen.getByLabelText("Client's name *", {selector: 'input'})).toHaveValue(""))
            await waitFor(() => expect(screen.getByLabelText("Client's firstname *", {selector: 'input'})).toHaveValue(""))
        })

        describe("faces an error when creating a client", function () {
            const server = new ServerBuilder()
                .request("/clients", "get", [])
                .request("/clients", "post", new APIErrorBody()
                    .withDetail(APIDetail("You must provide the client firstname", "value_error"))
                    .withDetail(APIDetail("You must provide the client lastname", "value_error"))
                    .build(), 422)
                .build()

            beforeAll(() => server.listen())

            afterEach(() => server.resetHandlers())

            afterAll(() => server.close())

            it("should display the error", async () => {
                render(<Clients/>)

                userEvent.click(screen.getByRole("button", {name: /add a new client/i}))
                userEvent.type(screen.getByText("Client's name"), "{empty}")
                userEvent.type(screen.getByText("Client's firstname"), "{empty}")
                userEvent.click(screen.getByRole("button", {name: /submit/i}))

                expect(await screen.findByText("An error occurred (see message below):", {selector: 'h5'})).toBeInTheDocument()
                await waitFor(() => expect(screen.queryByText("You must provide the client firstname", {selector: 'p'})).toBeInTheDocument())
                await waitFor(() => expect(screen.queryByText("You must provide the client lastname", {selector: 'p'})).toBeInTheDocument())
                await waitFor(() => expect(screen.queryAllByText("value_error", {selector: 'p'})).toBeTruthy())
            })
        })
    })
})