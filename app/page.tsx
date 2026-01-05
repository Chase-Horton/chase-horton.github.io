import Link from "next/link"
export default function Home() {
  return (
    <main>
      <h1 className="text-4xl font-black pb-4 w-full">Welcome to the Blog</h1>
      <p className="text-lg mb-4 w-full">
        This is the homepage of the blog. Navigate to individual posts to read more.
      </p>
      <ol>
        <li>
          <Link href="/blog/test">Go to Test Post</Link>
        </li>
        <li>
          <Link href="/blog/non-existent-post">Go to Non-Existent Post</Link>
        </li>
      </ol>
    </main>
  )
}
