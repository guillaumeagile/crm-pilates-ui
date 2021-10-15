import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    FormControl,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import * as React from "react";
import {useState} from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {createClient} from "../../features/clientsSlice";


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;
    padding-left: 100px;
`;


function ClientAccordionSummary() {
    return (
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1c-content"
            id="panel1c-header"
        sx={{textAlign: "center"}}>
            <Typography variant="h6" color="textSecondary">Add a new client</Typography>
        </AccordionSummary>
    )
}

export const CreateClientForm = () => {

    const dispatch = useDispatch()

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')

    const onFirstnameChanged = (e) => setFirstname(e.target.value)
    const onLastnameChanged = (e) => setLastname(e.target.value)

    const onSubmitClicked = async () => {
        await dispatch(createClient({firstname, lastname})).unwrap()
        setLastname('')
        setFirstname('')
    }

    return (
        <Accordion>
            <ClientAccordionSummary/>
            <AccordionDetails>
                <Wrapper>
                    <Grid container>
                        <Grid item xs={3}>
                            <FormControl>
                                <TextField id="client-name" className="sizeSmall"
                                           label="Client's name"
                                           helperText="Provide a client's name"
                                           required
                                           onChange={onLastnameChanged}
                                           aria-describedby="client-name-help"
                                           value={lastname}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3}>
                            <FormControl>
                                <TextField id="client-first-name" className="sizeSmall"
                                           label="Client's firstname"
                                           helperText="Provide a client's firstname"
                                           required
                                           onChange={onFirstnameChanged}
                                           aria-describedby="client-first-name-help"
                                           value={firstname}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Wrapper>
            </AccordionDetails>
            <Divider/>
            <AccordionActions>
                <Button onClick={onSubmitClicked} disabled={firstname === "" || lastname === ""}>Submit</Button>
            </AccordionActions>
        </Accordion>
    );

}
