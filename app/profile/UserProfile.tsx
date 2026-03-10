type UserProfileProps = {
  displayName: string;
  email: string;
  lastSignIn: string;
  handleSignOut: () => void;
};

export default function UserProfile({ displayName, email, lastSignIn, handleSignOut }: UserProfileProps) {
    return <div className="p-6 w-full">
    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          My Profile
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your account and order history.
        </p>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Name</dt>
              <dd className="mt-0.5 text-slate-900">
                {displayName ?? email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd className="mt-0.5 text-slate-900">{email ?? "—"}</dd>
              </div>
            <div>
              <dt className="font-medium text-slate-500">Last sign in</dt>
              <dd className="mt-0.5 text-slate-900">{lastSignIn}</dd>
              </div>
          </dl>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sign out
          </button>
        </section>
    </div>
}