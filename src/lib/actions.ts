"use server";

import { z } from "zod";
import { ContactFormSchema } from "./schemas";

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

export async function sendEmail(data: ContactFormInputs) {
	const result = ContactFormSchema.safeParse(data);

	if (result.error) {
		return { error: result.error.format() };
	}

	try {
		const res = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({...result.data, access_key: process.env.WEB3FORMS_ACCESS_KEY})
		}).then((res) => res.json());
		
		if (res.success) {
			return { success: true };
		} else {
			throw new Error("Failed to send email!");
		}
	} catch (error) {
		return { error };
	}
}