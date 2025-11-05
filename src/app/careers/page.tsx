"use client";

import Link from "next/link";
import { Briefcase, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
}

const jobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150K - $200K",
    description:
      "Join our engineering team to build scalable systems for millions of users. You'll work with modern tech stack and collaborate with talented engineers.",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    salary: "$130K - $170K",
    description:
      "Lead product strategy and roadmap for Swappio. Work with design and engineering teams to create features that delight users.",
  },
  {
    id: "3",
    title: "Community Manager",
    department: "Community",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70K - $90K",
    description:
      "Build and nurture our vibrant community. Engage with users, organize events, and gather feedback to improve Swappio.",
  },
  {
    id: "4",
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "Full-time",
    salary: "$140K - $190K",
    description:
      "Use data to drive product decisions. Build models and analyze user behavior to optimize platform performance.",
  },
  {
    id: "5",
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100K - $140K",
    description:
      "Create beautiful and intuitive interfaces. Design the next generation of Swappio experiences.",
  },
  {
    id: "6",
    title: "Customer Support Specialist",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    salary: "$50K - $70K",
    description:
      "Help our users succeed. Provide excellent customer support and build lasting relationships with community members.",
  },
];

export default function CareersPage() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-muted-foreground">
              Help us build the future of peer-to-peer trading
            </p>
          </div>

          {/* About Working at Swappio */}
          <div className="mb-12 bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Why Work at Swappio?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">🚀 Impact</h3>
                <p className="text-muted-foreground">
                  Work on a platform that&apos;s changing how people trade and
                  connect globally.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🌟 Growth</h3>
                <p className="text-muted-foreground">
                  Continuous learning opportunities and career development in a
                  fast-growing company.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">❤️ Culture</h3>
                <p className="text-muted-foreground">
                  Join a diverse, inclusive team that values collaboration and
                  innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  <Button>
                    Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* No positions? */}
          {jobPostings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Currently, we don&apos;t have any open positions. Check back
                soon!
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">✅ Health & Wellness</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive health insurance, mental health support, and
                  fitness benefits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✅ Flexible Work</h3>
                <p className="text-sm text-muted-foreground">
                  Remote-friendly policies and flexible working hours to
                  maintain work-life balance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  ✅ Learning & Development
                </h3>
                <p className="text-sm text-muted-foreground">
                  Professional development budget and access to learning
                  resources.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✅ Equity</h3>
                <p className="text-sm text-muted-foreground">
                  Stock options to share in Swappio&apos;s success and growth.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Recruiting</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
