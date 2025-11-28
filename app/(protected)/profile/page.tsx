/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// app/(protected)/profile/page.tsx
"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <>
      {}
      <style jsx>{`
        .profile-pic-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .profile-pic-upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .profile-pic-wrapper:hover .profile-pic-upload-overlay {
          opacity: 1;
        }
      `}</style>

      <div className="container-lg py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            
            {/* --- Info Profil & Upload --- */}
            <div className="text-center my-5">
              <div className="profile-pic-wrapper mx-auto mb-3">
                <img
                  src="https://via.placeholder.com/80" 
                  alt="John Doe"
                  className="img-fluid rounded-circle"
                  width="80"
                  height="80"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="profile-pic-upload-overlay"
                >
                  <i className="bi bi-pencil-fill fs-4"></i>
                  <input
                    type="file"
                    className="d-none"
                    id="profile-picture-upload"
                  />
                </label>
              </div>

              <h2 className="fs-2 fw-bold">John Doe</h2>
              <p className="text-muted">john.doe@example.com</p>
              <p className="text-muted small mt-3">
                Upload a new profile picture. Supported formats: JPG, PNG. Max
                size: 2MB.
              </p>

              {/* Feedback Messages (cth) */}
              <div className="w-75 mx-auto mt-3">
                {/* <div className="alert alert-success small">
                  Profile picture updated successfully.
                </div>
                <div className="alert alert-danger small">
                  Error uploading file. Please try again.
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "40%" }}
                  ></div>
                </div> */}
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-outline-danger fw-bold">
                  Logout
                </button>
                <button className="btn btn-dark fw-bold">
                  <i className="bi bi-bookmark me-2"></i>
                  Bookmark Page
                </button>
              </div>
            </div>

            {/* --- Form & History --- */}
            <div className="my-5 pt-5 border-top">
              {/* 1. Manage Account */}
              <div id="manage-account" className="mb-5">
                <h3 className="fs-3 fw-bold mb-4">Manage Account Information</h3>
                
                {/* Contoh Feedback Sukses */}
                <div className="alert alert-success">
                  Your name has been updated successfully.
                </div>

                <form className="mb-5">
                  <h4 className="fs-5 fw-semibold mb-3">Change Name</h4>
                  <div className="mb-3">
                    <label htmlFor="newName" className="form-label visually-hidden">
                      New Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newName"
                      placeholder="Enter new name"
                    />
                  </div>
                  <button type="submit" className="btn btn-dark px-4 fw-bold">
                    Save Changes
                  </button>
                </form>
                
                {/* Contoh Feedback Error */}
                <div className="alert alert-danger">
                  The password must be at least 8 characters long.
                </div>

                <form>
                  <h4 className="fs-5 fw-semibold mb-3">Change Password</h4>
                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className="form-label visually-hidden"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder="Enter new password"
                    />
                  </div>
                  <button type="submit" className="btn btn-dark px-4 fw-bold">
                    Save Changes
                  </button>
                </form>
              </div>

              {/* 2. Comment History */}
              <div id="comment-history" className="mt-5 pt-5 border-top">
                <h3 className="fs-3 fw-bold mb-4">Comment History</h3>
                <div className="d-flex flex-column gap-3">
                  
                  {/* Komentar 1 */}
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      <p className="card-text fst-italic mb-2">
                        "This is an insightful article. I really appreciate the
                        depth of the analysis provided here. It has given me a
                        new perspective on the topic."
                      </p>
                      <Link
                        href="#"
                        className="card-subtitle small text-muted text-decoration-none"
                      >
                        on "The Future of Artificial Intelligence"
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">2 days ago</small>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary border-0">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Komentar 2 */}
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      <p className="card-text fst-italic mb-2">
                        "I have a different take on this. While the author
                        makes some valid points, I believe the situation is
                        more complex than portrayed."
                      </p>
                      <Link
                        href="#"
                        className="card-subtitle small text-muted text-decoration-none"
                      >
                        on "Global Economic Trends 2023"
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">1 week ago</small>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary border-0">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Komentar 3 */}
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      <p className="card-text fst-italic mb-2">
                        "Great summary! This is exactly what I was looking
                        for. Thank you for putting this together."
                      </p>
                      <Link
                        href="#"
                        className="card-subtitle small text-muted text-decoration-none"
                      >
                        on "A Beginner's Guide to Quantum Computing"
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">3 weeks ago</small>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary border-0">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* 3. Pagination */}
              <nav aria-label="Comment pagination" className="d-flex justify-content-center mt-5">
                <ul className="pagination shadow-sm">
                  <li className="page-item">
                    <a className="page-link" href="#">
                      <i className="bi bi-chevron-left"></i>
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}