import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, FileText, PhoneCall, Mail } from "lucide-react"
import { getSession } from "@/lib/auth"
import pool from "@/lib/db"
import { DeleteBlogButton, LogoutButton, UpdateEnquiryStatus, UpdateContactStatus } from "./actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RowDataPacket } from "mysql2"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/admin/login")
  }

  let allPosts: RowDataPacket[] = []
  let allEnquiries: RowDataPacket[] = []
  let allContactMsgs: RowDataPacket[] = []

  try {
    const [blogs] = await pool.execute<RowDataPacket[]>("SELECT * FROM blogs ORDER BY published_date DESC")
    allPosts = blogs || []

    const [enquiries] = await pool.execute<RowDataPacket[]>("SELECT * FROM enquiries ORDER BY created_at DESC")
    allEnquiries = enquiries || []

    const [contacts] = await pool.execute<RowDataPacket[]>("SELECT * FROM contact_messages ORDER BY created_at DESC")
    allContactMsgs = contacts || []
  } catch (error) {
    console.error("Error fetching admin data:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
              FE
            </div>
            <div>
              <h1 className="font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage Content & Enquiries</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Blogs</CardDescription>
              <CardTitle className="text-3xl">{allPosts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quick Enquiries</CardDescription>
              <CardTitle className="text-3xl">{allEnquiries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Contact Messages</CardDescription>
              <CardTitle className="text-3xl">{allContactMsgs.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="blogs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            <TabsTrigger value="enquiries">Quick Enquiries</TabsTrigger>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>Manage your blog content</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/dashboard/create">
                      <Plus className="mr-2 h-4 w-4" />
                      New Post
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {allPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No blog posts yet. Create your first one!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{post.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>By {post.author_name}</span>
                              <span>•</span>
                              <span>{new Date(post.published_date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="text-green-600">Published</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/dashboard/edit/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteBlogButton blogId={post.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Quick Enquiries</CardTitle>
                <CardDescription>Form submissions from the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                {allEnquiries.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <PhoneCall className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No enquiries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allEnquiries.map((enq) => (
                      <div key={enq.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                        <div>
                          <h3 className="font-medium">{enq.name}</h3>
                          <div className="text-sm text-muted-foreground flex gap-3 flex-wrap mt-1">
                            <span>📱 {enq.phone}</span>
                            <span>📚 {enq.course}</span>
                            <span>⏱️ {new Date(enq.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <UpdateEnquiryStatus id={enq.id} currentStatus={enq.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>Form submissions from the contact page</CardDescription>
              </CardHeader>
              <CardContent>
                {allContactMsgs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No contact messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allContactMsgs.map((msg) => (
                      <div key={msg.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{msg.first_name} {msg.last_name}</h3>
                            <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-muted-foreground flex gap-3 flex-wrap my-2 border-l-2 pl-3 border-primary/20">
                            <span>📧 {msg.email}</span>
                            <span>📱 {msg.phone}</span>
                            {msg.course && <span>📚 {msg.course}</span>}
                          </div>
                          <p className="text-sm border border-border p-3 rounded bg-muted/30">{msg.message}</p>
                        </div>
                        <div className="ml-0 sm:ml-4 flex items-center h-full">
                          <UpdateContactStatus id={msg.id} currentStatus={msg.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
