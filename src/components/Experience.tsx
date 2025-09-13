import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import certificationData from "@/data/certifications.json";
import { careerSchema, educationSchema, certificationSchema } from "@/lib/schemas";
import Timeline from "./Timeline";

export default function Experience() {
	const career = careerSchema.parse(careerData).career;
	const education = educationSchema.parse(educationData).education;
	const certifications = certificationSchema.parse(certificationData).certifications;

	return (
		<Tabs defaultValue="work">
			<TabsList className="mb-2 grid w-full grid-cols-3">
				<TabsTrigger value="work">Work</TabsTrigger>
				<TabsTrigger value="education">Education</TabsTrigger>
				<TabsTrigger value="certifications">Certifications</TabsTrigger>
			</TabsList>
			<TabsContent value="work">
				<Timeline experience={career}></Timeline>
			</TabsContent>
			<TabsContent value="education">
				<Timeline experience={education}></Timeline>
			</TabsContent>
			<TabsContent value="certifications">
				<Timeline experience={certifications}></Timeline>
			</TabsContent>
		</Tabs>
	);
}