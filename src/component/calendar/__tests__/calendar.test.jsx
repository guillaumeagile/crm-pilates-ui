import {render} from "../../../test-utils/test-utils";
import {screen} from "@testing-library/react";
import React from "react";
import Calendar from "../calendar";
import {formatISO, subHours} from "date-fns";
import {ServerBuilder} from "../../../test-utils/server/server";
import {attendee, SessionBuilder, SessionsBuilder} from "../../../test-utils/classroom/session";

describe('Calendar page', function () {
    let currentDate = new Date();
    let currentMonth = currentDate.toISOString()
    let previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()).toISOString()
    let nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()).toISOString()

    const server = new ServerBuilder()
        .request("/sessions", "get",
            JSON.stringify(new SessionsBuilder()
                .withSession(
                    new SessionBuilder().withClassroom(1).withName('Pilates avancé')
                        .withSchedule(formatISO(subHours(currentDate, 5)), 1).withPosition(3)
                        .withAttendee(attendee(1, "Laurent", "Gas", "CHECKED_IN"))
                        .withAttendee(attendee(2, "Pierre", "Bernard", "REGISTERED"))
                        .build()
                )
                .withSession(
                    new SessionBuilder().withId(1).withClassroom(1).withName('Pilates machine')
                        .withSchedule(formatISO(subHours(currentDate, 4)), 1).withPosition(3)
                        .withAttendee(attendee(3, "Bertrand", "Bougon", "REGISTERED"))
                        .build()
                )
                .withSession(
                    new SessionBuilder().withId(2).withClassroom(2).withName('Pilates tapis')
                        .withSchedule(formatISO(subHours(currentDate, 3)), 1).withPosition(4)
                        .build()
                )
                .withSession(
                    new SessionBuilder().withClassroom(3).withName('Cours duo')
                        .withSchedule(formatISO(subHours(currentDate, 2)), 1).withPosition(2)
                        .build()
                )
                .withSession(
                    new SessionBuilder().withId(13).withClassroom(1).withName('Cours trio')
                        .withSchedule(formatISO(subHours(currentDate, 1)), 1).withPosition(3)
                        .build()
                )
                .withSession(
                    new SessionBuilder().withId(4).withClassroom(1).withName('Cours privé')
                        .withSchedule(formatISO(currentDate), 1).withPosition(1)
                        .withAttendee(attendee(3, "Bertrand", "Bougon", "CHECKED_IN"))
                        .build()
                )
                .build()),
            200,
            {"X-Link": `</sessions?month=${previousMonth}>; rel="previous", </sessions?month=${currentMonth}>; rel="current", </sessions?month=${nextMonth}>; rel="next"`}
        )
        .request("/clients", "get", [])
        .build()

    beforeAll(() => server.listen())

    afterEach(() => server.resetHandlers())

    afterAll(() => server.close())

    it('should have a plus button on each day', () => {
        render(<Calendar date={new Date("2021-10-10T11:20:00")}/>)

        expect(screen.getAllByTestId("AddIcon")).toHaveLength(26)
    })


})