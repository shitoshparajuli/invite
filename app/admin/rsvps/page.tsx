import { getAllRSVPs } from '../../actions/rsvp';

export default async function AdminRSVPsPage() {
  const result = await getAllRSVPs();

  if (!result.success || !result.rsvps) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-light mb-8">RSVP Management</h1>
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
            Failed to load RSVPs
          </div>
        </div>
      </div>
    );
  }

  const allRecords = result.rsvps;

  // Separate submitted RSVPs from check-only records
  // If name is NULL, they only checked but haven't actually RSVPd
  const submittedRSVPs = allRecords.filter(r => r.name !== null);
  const checkOnlyRecords = allRecords.filter(r => r.name === null && r.lastCheckedAt !== null);

  const attendingGuests = submittedRSVPs.filter(r => r.attending);
  const decliningGuests = submittedRSVPs.filter(r => r.attending === false);
  const totalGuestCount = attendingGuests.reduce((sum, r) => sum + (r.numberOfGuests || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light mb-8 text-gray-900">RSVP Management</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-light text-gray-900">{submittedRSVPs.length}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Total RSVPs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-light text-green-600">{attendingGuests.length}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Attending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-light text-red-600">{decliningGuests.length}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Declined</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-light text-blue-600">{totalGuestCount}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Total Guests</div>
          </div>
        </div>

        {/* Check-Only Records Alert */}
        {checkOnlyRecords.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {checkOnlyRecords.length} {checkOnlyRecords.length === 1 ? 'person has' : 'people have'} checked but not submitted RSVP
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>These guests looked up their RSVP but haven't submitted a response yet.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submitted RSVPs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Submitted RSVPs</h2>
          </div>
          {submittedRSVPs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No RSVPs submitted yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedRSVPs.map((rsvp, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rsvp.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {rsvp.attending ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Attending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.attending ? rsvp.numberOfGuests : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.submittedAt && new Date(rsvp.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Check-Only Records Table */}
        {checkOnlyRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
              <h2 className="text-lg font-medium text-gray-900">Checked But Not Submitted</h2>
              <p className="text-sm text-gray-600 mt-1">These guests looked up their RSVP but haven't responded yet</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Checked
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checkOnlyRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.lastCheckedAt && new Date(record.lastCheckedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
