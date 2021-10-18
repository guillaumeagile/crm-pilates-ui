import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Grid} from "@material-ui/core";
import {Box, Card, CardContent, CardHeader, Fade, Popper, Typography} from "@mui/material";
import {blue} from "@mui/material/colors";
import {format} from "date-fns";
import * as React from "react";
import {useState} from "react";

const theme = createTheme({
    typography: {
        h5: {
            fontSize: "0.7rem",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 800,
            lineHeight: 1.334,
            letterSpacing: "0em"
        },
        body1: {
            fontSize: "0.8rem",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: "0em",
        },
        fontSize: 10
    },
});


export const ClassroomEventItem = ({classroom: session}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const displaySession = () => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    }

    return (
        <Grid container>
            <Popper open={open} anchorEl={anchorEl} placement="right-start" transition>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Card>
                            <CardContent>
                                <CardHeader title={session.name} subheader={format(session.schedule.start, "yyyy-MM-dd H:mm")} component="div"/>
                            </CardContent>
                        </Card>
                    </Fade>
                )}
            </Popper>
            <Grid container onClick={displaySession()}>
                <Grid item xs={6}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}>
                            <Typography variant="body1">
                                {session.name}
                            </Typography>
                        </Box>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={2}>

                    <ThemeProvider theme={theme}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography color={blue[400]}>
                                {session.attendees.length} / {session.position}
                            </Typography>
                        </Box>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={4}>

                    <ThemeProvider theme={theme}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <Typography>
                                {format(session.schedule.start, 'k:mm')}
                            </Typography>
                        </Box>
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Grid>
    )
};