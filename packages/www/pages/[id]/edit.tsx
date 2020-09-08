import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { Formik, Field } from "formik";
import {
	Button,
	Stack,
	FormControl,
	FormLabel,
	Input,
	Text,
	Textarea,
	Select,
	CircularProgress,
	FormErrorMessage,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import url from "../../src/appUrl";
import Note from ".";

const EditNote = ({ note }) => {
	const router = useRouter();
	function validateTitle(value) {
		let error;
		if (!value) {
			error = "Title is required";
		}
		return error;
	}

	function validateBody(value) {
		let error;
		if (!value) {
			error = "Note Body is required";
		}
		return error;
	}

	return (
		<Formik
			initialValues={{
				title: note.title,
				body: note.body,
				category: note.category,
			}}
			onSubmit={async (values, actions) => {
				try {
					const response = await fetch(url.noteEndpointDev, {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(values),
					});
					actions.setSubmitting(false);
					router.push("/");
				} catch (error) {
					console.log(error);
				}
			}}
		>
			{(props) => (
				<form onSubmit={props.handleSubmit}>
					<Stack maxWidth={600} margin="auto" spacing={5} marginTop={5}>
						<Text>Update Post</Text>
						<Field name="title" validate={validateTitle}>
							{({ field, form }) => (
								<FormControl isInvalid={form.errors.title}>
									<Input
										{...field}
										id="title"
										placeholder="Note Title"
										variant="flushed"
									/>
									<FormErrorMessage>{form.errors.title}</FormErrorMessage>
								</FormControl>
							)}
						</Field>

						<Field name="category">
							{({ field, form }) => (
								<FormControl>
									<Select
										variant="flushed"
										placeholder="Select Category"
										{...field}
									>
										<option value="others">Others</option>
										<option value="work">Work</option>
										<option value="study">Study</option>
										<option value="personal">Personal</option>
									</Select>
								</FormControl>
							)}
						</Field>

						<Field name="body" validate={validateBody}>
							{({ field, form }) => (
								<FormControl isInvalid={form.errors.body}>
									<Textarea
										{...field}
										variant="flushed"
										placeholder="Note Body"
									/>
									<FormErrorMessage>{form.errors.body}</FormErrorMessage>
								</FormControl>
							)}
						</Field>
						<Button
							mt={4}
							variantColor="teal"
							isLoading={props.isSubmitting}
							type="submit"
						>
							Update Note
						</Button>
					</Stack>
				</form>
			)}
		</Formik>
	);
};

EditNote.getInitialProps = async (ctx) => {
	const note = await fetch(`${url.noteEndpointDev}/${ctx.query.id}`);
	const data = await note.json();
	return { note: data };
};

export default EditNote;
