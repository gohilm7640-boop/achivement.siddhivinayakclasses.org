import { forwardRef } from 'react';
import './Poster.css';

export interface PosterData {
    studentName: string;
    rank: string;
    examSubtitle: string;
    pr: string;
    grade: string;
    photoUrl: string | null;
    subjects: { name: string; marks: string }[];
    phone: string;
}

interface PosterProps {
    data: PosterData;
}

export const Poster = forwardRef<HTMLDivElement, PosterProps>(({ data }, ref) => {
    return (
        <div className="poster-wrapper-exact" ref={ref} style={{ backgroundColor: '#FF00CC' }}>
            {/* White border inset by 12px */}
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, backgroundColor: '#ffffff' }}>
                {/* Green border inset by another 6px */}
                <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, backgroundColor: '#00FF00' }}>
                    {/* Blue background inset by another 6px */}
                    <div className="inner-blue-bg" style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, width: 'auto', height: 'auto' }}>

                        <div className="header-row-exact">
                            <div className="logo-box-exact">
                                <img src="/ssv-logo.jpg" alt="SSV" />
                            </div>
                            <div className="header-text-exact">
                                <h1>શ્રી સિદ્ધિ વિનાયક ટ્યુશન ક્લાસીસ</h1>
                                <p className="address-exact">215, 216, 217, હરિહર કોમ્પ્લેક્ષ, ઝાડેશ્વર રોડ, ભરૂચ</p>
                                <div className="exam-badge-exact">
                                    {data.examSubtitle || "૨૦૨૪-૨૫ નું ધોરણ ૧૦ નું પરિણામ"}
                                </div>
                            </div>
                            <div className="logo-box-exact">
                                <img src="/ssv-logo.jpg" alt="SSV" />
                            </div>
                        </div>

                        <h2 className="congrats-text-exact">Congratulations!</h2>

                        <div className="main-content-exact">
                            <div className="left-col-exact">
                                <div className="pr-box-exact">PR : {data.pr || "XX.XX"}</div>
                                <div className="photo-wrapper-exact">
                                    <img
                                        src={data.photoUrl || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22533%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20533%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3C%2Fsvg%3E"}
                                        alt="Student"
                                        className="student-img-exact"
                                    />
                                    <div className="grade-star-exact">
                                        <span>{data.grade || "A2"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="right-col-exact">
                                {data.subjects.map((sub, idx) => (
                                    <div key={idx} className="subject-row-exact">
                                        <div className="subject-name-exact">{sub.name || `SUBJECT ${idx + 1}`}</div>
                                        <div className="subject-marks-exact">{sub.marks || ['98/100', '94/100', '91/100', '97/100'][idx % 4]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="name-bar-exact">
                            {data.studentName || "FIRST LAST NAME"} ({data.rank || "RANK / TITLE"})
                        </div>

                        <div className="contact-bar-exact">
                            <div className="contact-label-exact">-: એડમિશન માટે સંપર્ક :-</div>
                            <div className="contact-num-exact">Mo. {data.phone || "9999999999, 8888888888"}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
});

Poster.displayName = 'Poster';
