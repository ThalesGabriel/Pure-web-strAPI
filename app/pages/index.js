import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import Page from "../components/Page";
import { useFormik } from "formik";
import * as yup from "yup";
import gql from 'graphql-tag'
import {useLazyQuery, useMutation} from '@apollo/react-hooks'
import JSONPretty from 'react-json-pretty';

const validationSchema = yup.object({
  url: yup.string().required("Required Field"),
});

export const IS_REPOSITORY_IN_DATABASE = gql`
  query isRepositoryInDatabase(
    $url: String!
  ) {
    isRepositoryInDatabase(
      url: $url
    ) 
  }
`;

export const GET_INFO_FROM_REPOSITORY = gql`
  query getInfoFromRepository(
    $url: String!
  ) {
    getInfoFromRepository(
      url: $url 
    ) {
      id
      name
      user
      data
    }
  }
`;

export const CREATE_INFO_REPOSITORY = gql`
  mutation createInfoRepository (
    $url: String!
  ) {
    createInfoRepository(url: $url)
  }
`;

export default function Index() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      url: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue, resetForm }) => {
      const { url } = values;
      setLoading(true)
      // setData(null)
      await launchIsRepositoryInDatabase({variables: { url }})
    },
  });

  const [launchIsRepositoryInDatabase, isRepositoryInDatabaseQuery] = useLazyQuery(IS_REPOSITORY_IN_DATABASE, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      if(data.isRepositoryInDatabase.requestedUrl) {
        await createInfoRepository({ variables: { url: data.isRepositoryInDatabase.requestedUrl }})
      } else {
        await launchGetInfoFromRepositoryQuery({ variables: { url: data.isRepositoryInDatabase.url }})
      }
    },
    onError: (error) => {}
  });

  const [launchGetInfoFromRepositoryQuery, getInfoFromRepositoryQuery] = useLazyQuery(GET_INFO_FROM_REPOSITORY, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      console.log(data)
      setData(data.getInfoFromRepository)
      setLoading(false)
    },
    onError: (error) => {}
  });

  const [createInfoRepository, createInfoRepositoryMutation] = useMutation(CREATE_INFO_REPOSITORY, {
    onCompleted: async (data) => {
      await launchGetInfoFromRepositoryQuery({ variables: { url: data.createInfoRepository }})
    },
    onError: (error) => {},
  });

  return (
    <Page>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box style={{ margin: 10, marginBottom: 40, textAlign: "justify" }}>
            <Typography>
              Welcome to this app! You can search for information from a given
              repository by filling out the form below. You have some manners
              about how to
            </Typography>
            <br />
            <Typography>
              &#9679; https://github.com/ThalesGabriel/semana-omnistack11
            </Typography>
            <Typography>&#9679; ThalesGabriel/semana-omnistack11</Typography>
          </Box>
          <TextField
            variant="outlined"
            label="Input repository url *"
            placeholder="Repository url *"
            name={"url"}
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
          />
          <Typography style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
            * REQUIRED FIELD
          </Typography>
          <Box style={{ margin: 10, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              disabled={!(formik.isValid && formik.dirty) || loading}
              onClick={formik.handleSubmit}
            >
              {loading? 
                <CircularProgress size={20}/> 
              : 
                "Get Info"
              }
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box style={{paddingLeft: 50}}>
            <Typography style={{marginBottom: 20}}>Resultado</Typography>
            <JSONPretty id="json-pretty" data={data}></JSONPretty>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
}
