import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BarChart, MapPin } from "lucide-react"

const courses = [
  {
    id: "cnc-turning-milling",
    title: "CNC Turning & Milling",
    description:
      "Comprehensive training from operator level to advanced programming covering VTL/HTL turning and VMC/HMC milling operations.",
    duration: "30 Days (Full Time) / 60 Days (Part Time)",
    level: "All Levels",
    mode: "Offline Only",
  },
  {
    id: "cadcam-training",
    title: "CAD/CAM Training",
    description:
      "Master AutoCAD 2D/3D, UNIGRAPHICS, and MASTERCAM with complete part modeling, assembly, and toolpath generation.",
    duration: "Full Time: 9:30 AM - 4:30 PM / Part Time: 3 hrs/day",
    level: "Beginner to Advanced",
    mode: "Offline Only",
  },
  {
    id: "quality-management",
    title: "Advanced Quality Management System",
    description:
      "Complete quality management training covering ISO 9001, Six Sigma, SPC, PPAP, FMEA, MSA, audits, and quality tools.",
    duration: "1 Month (Full Time: 9:30 AM - 4:00 PM)",
    level: "Professional",
    mode: "Offline Only",
  },
  {
    id: "advanced-diploma-manufacturing",
    title: "Advanced Diploma Manufacturing",
    description:
      "Comprehensive 6-month program covering all aspects: turning, milling, CAD/CAM, and quality management systems.",
    duration: "6 Months (Full Time: 9:30 AM - 4:00 PM)",
    level: "Complete Professional Program",
    mode: "Offline Only",
  },
  {
    id: "industrial-automation",
    title: "Industrial Automation",
    description: "Training in PLC programming, robotics, and modern automation systems for manufacturing environments.",
    duration: "Custom Duration",
    level: "Intermediate to Advanced",
    mode: "Offline Only",
  },
  {
    id: "cnc-maintenance",
    title: "CNC Maintenance",
    description:
      "Learn all types of maintenance work, parameter setting, troubleshooting, and machine calibration procedures.",
    duration: "Custom Duration",
    level: "Advanced",
    mode: "Offline Only",
  },
]

export default function CoursesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="inline-block px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full text-sm font-semibold text-primary mb-4 animate-in fade-in slide-in-from-top duration-500">
            Training Programs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-in fade-in slide-in-from-bottom duration-700">
            Our Courses
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mb-6 rounded-full animate-in fade-in slide-in-from-left duration-700 delay-200"></div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            Comprehensive CNC and manufacturing training programs designed to take you from beginner to industry-ready
            professional. All courses include hands-on practice with real CNC machines.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BarChart className="h-3 w-3" />
                      {course.level}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {course.mode}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href={`/courses/${course.id}`}>View Full Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your CNC Career?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Contact us today to learn more about our courses, schedule a facility tour, or enroll in your chosen
            program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Enquire for Admission</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/youtube">Watch Free Sample Lectures</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
