import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Camera, Image as ImageIcon, Save, Plus, Minus } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

// Import images
import oil from "../assets/Oil.jpg";
import setoff from "../assets/Set Off2.jpg";
// import patches from "../assets/Patches.jpg";
import yarn from "../assets/Yarn Mistake.jpg";
import hole from "../assets/Hole.jpg";
// import gsm from "../assets/GSM Hole.jpg";
// import compact from "../assets/Compact Kadi.jpg";
import needleImg from "../assets/Needle Line.jpg";
// import stain from "../assets/Stain.jpg";
// import roll from "../assets/Roll Joint.jpg";

const QualityInspectionFullScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const h_code = location.state?.h_code;
  const r_code = location.state?.r_code;
  const { rollData } = location.state || {};
  const rollNumber = rollData?.rlno || "";

    const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const defectTypes = [
    { id: 1, name: "OIL", hindi: "तेल", tamil: "ஆயில்", img: oil },
    { id: 2, name: "HOLES", hindi: "छेद", tamil: "ஹோல்ஸ்", img: hole },
    { id: 3, name: "SET OFF", hindi: "सेट ऑफ", tamil: "செட் ஆப்", img: setoff },
    { id: 4, name: "NEEDLE LINE", hindi: "सुई रेखा", tamil: "நீடில் லைன்", img: needleImg },
    { id: 5, name: "YARN MISTAKE", hindi: "यार्न मिस्टैक", tamil: "யான் மிஸ்டேக்", img: yarn },
    { id: 6, name: "POOVARI", hindi: " पूवारी", tamil: "பூவாரி", img: null },
    { id: 7, name: "LYCRA CUT", hindi: "लाइक्रा कट", tamil: "லைக்ரா வெட்டு", img: null },
    { id: 8, name: "NEPS", hindi: "नेप्स", tamil: "நேப்ஸ்", img: null },
    { id: 9, name: "NA HOLES", hindi: "ना होल", tamil: "நா ஹோல்", img: null }
  ];

  const POPUP_DEFECTS = ["OIL", "HOLES", "POOVARI", "LYCRA CUT", "NEPS", "NA HOLES"];
  const DECREASE_POPUP_DEFECTS = ["SET OFF", "YARN MISTAKE"];

  // --- STATE ---
  const [defectData, setDefectData] = useState(defectTypes.map(() => ({ count: 0, meter: "", display: "" })));
  const [time, setTime] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [popupAction, setPopupAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDefectIndex, setActiveDefectIndex] = useState(null);
  const [showDecreasePopup, setShowDecreasePopup] = useState(false);
  const [activeDecreaseIndex, setActiveDecreaseIndex] = useState(null);
  const [showNeedlePopup, setShowNeedlePopup] = useState(false);
  const [needleMeterValue, setNeedleMeterValue] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);

  const cameraInputRef = useRef(null);
  const needleIndexRef = useRef(null);
  const hasCheckedInitialRef = useRef(false);
  const timerStartRef = useRef(null);
  const payloadRef = useRef(null);
  const navigate = useNavigate();

  // --- LOGIC HELPERS ---
  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${ss}`;
  };

  const getPayload = () => {
    const getVal = (name) => {
      const idx = defectTypes.findIndex((d) => d.name === name);
      return idx !== -1 ? (defectData[idx].display || "") : "";
    };

    return {
      dt: new Date().toISOString().split("T")[0],
      rlno: String(rollNumber),
      hole: getVal("HOLES"),
      setoff: getVal("SET OFF"),
      needle_line: getVal("NEEDLE LINE"),
      oil_line: getVal("OIL"),
      oil_drops: "",
      remark: String(remarks || ""),
      poovari: getVal("POOVARI"),
      yarn_mistake: getVal("YARN MISTAKE"),
      lycra_cut: getVal("LYCRA CUT"),
      yarn_uneven: "",
      neps: getVal("NEPS"),
      timer: formatTime(time),
      dia:  String(safeNumber(rollData?.dia)),
      na_holes: getVal("NA HOLES"),
      empid: r_code,
      m12: "",
      loop_len: String(safeNumber(rollData?.ll)),
      image: capturedImage || "",
      submit: isSubmitted
    };
  };

  const defectFieldMap = {
  "OIL": "oil_line",
  "HOLES": "hole",
  "SET OFF": "setoff",
  "NEEDLE LINE": "needle_line",
  "POOVARI": "poovari",
  "YARN MISTAKE": "yarn_mistake",
  "LYCRA CUT": "lycra_cut",
  "NEPS": "neps",
  "NA HOLES": "na_holes",
   };

const fetchRollData = async () => {
  try {
    if (!rollNumber) return;

    const res = await fetch(
      `https://app.herofashion.com/coraroll/${rollNumber}/`
    );

    if (!res.ok) return;

    const data = await res.json();
    console.log("GET API data:", data);
    setCapturedImage(data.image || "");

    setDefectData(
      defectTypes.map((defect) => {
        const backendField = defectFieldMap[defect.name];
        const value =
          backendField && data[backendField]
            ? String(data[backendField])
            : "";

        let count = 0;
        let meter = "";

        if (value) {
          const cMatch = value.match(/C-(\d+)/);
          const mMatch = value.match(/M-(\d+)/);
          if (cMatch) count = Number(cMatch[1]);
          if (mMatch) meter = mMatch[1];
        }

        return {
          count,
          meter,
          display: value,
        };
      })
    );

    setRemarks(data.remark || "");

  if (data.timer) {
    const parts = data.timer.split(":").map(Number);
    let seconds = 0;

    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    setTime(seconds);
    timerStartRef.current = Date.now() - seconds * 1000;
  }

  } catch (err) {
    console.error("GET API error:", err);
  }
};

  useEffect(() => {
    if (rollNumber) {
      fetchRollData();
    }
  }, [rollNumber]);

  // --- API SYNC LOGIC --- 
  // -- PUT
  useEffect(() => {
    if (!rollNumber) return;

    const detailUrl = `https://app.herofashion.com/coraroll/${rollNumber}/`;

    const putData = async () => {
      try {
        if (!payloadRef.current) return;

        const res = await fetch(detailUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadRef.current),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("PUT error:", text);
        }
      } catch (err) {
        console.error("PUT failed:", err);
      }
    };

    const interval = setInterval(putData, 2000); // every 2 sec
    return () => clearInterval(interval);
  }, [rollNumber]);

// -- POST
  useEffect(() => {
    if (!rollNumber || hasCheckedInitialRef.current) return;

    const postOnce = async () => {
      const baseUrl = `https://app.herofashion.com/coraroll/`;
      const detailUrl = `${baseUrl}${rollNumber}/`;

      const checkRes = await fetch(detailUrl);
      if (checkRes.ok) {
        hasCheckedInitialRef.current = true;
        return;
      }

      await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getPayload()),
      });

      hasCheckedInitialRef.current = true;
    };

    postOnce();
  }, [rollNumber]);

  useEffect(() => {
    payloadRef.current = getPayload();
  }, [defectData, remarks, time, rollNumber, capturedImage]);

  // Timer
 useEffect(() => {
      if (!timerStartRef.current) {
        timerStartRef.current = Date.now();
      }

      const interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - timerStartRef.current) / 1000
        );
        setTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
  }, []);

 const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("rlno", rollNumber);

    const res = await fetch("https://app.herofashion.com/upload-roll-image/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCapturedImage(data.image); 
  };
  
  // --- UI ACTIONS ---
  const updateDefect = (index, delta = 0, meter = null, display = null) => {
    setDefectData((prev) => {
      const data = [...prev];
      const item = { ...data[index] };
      const newCount = item.count + delta;
      if (newCount >= 0) item.count = newCount;
      if (meter !== null && meter !== "") item.meter = String(meter);
      
      if (display !== null) {
        item.display = display;
      } else {
        const parts = [];
        if (item.count > 0) parts.push(`C-${item.count}`);
        if (item.meter !== "") parts.push(`M-${item.meter}`);
        item.display = parts.join(" ").toUpperCase();
      }
      data[index] = item;
      return data;
    });
    setShowModal(false);
  };

  const handlePlusClick = (index, name) => {
    setPopupAction("plus");
    if (name === "NEEDLE LINE") {
      needleIndexRef.current = index;
      setShowNeedlePopup(true);
    } else if (POPUP_DEFECTS.includes(name)) {
      setActiveDefectIndex(index);
      setShowModal(true);
    } else { updateDefect(index, 1); }
  };

  const handleMinusClick = (index, name) => {
    setPopupAction("minus");
    if (POPUP_DEFECTS.includes(name)) {
      setActiveDefectIndex(index);
      setShowModal(true);
    } else if (name === "NEEDLE LINE") {
      needleIndexRef.current = index;
      setShowNeedlePopup(true);
    } else if (DECREASE_POPUP_DEFECTS.includes(name)) {
      setActiveDecreaseIndex(index);
      setShowDecreasePopup(true);
    } else { updateDefect(index, -1); }
  };

  const HeaderField = ({ label, value }) => (
    <div className="col">
      <span className="fw-bold small d-block" style={{ color: "#2563EB" }}>{label}</span>
      <span className="fw-semibold small">{value || "---"}</span>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light p-md-4 p-2 font-sans d-flex flex-column position-relative">
      {showModal && <CountMeterModal onClose={() => setShowModal(false)} onSave={(c, m) => updateDefect(activeDefectIndex, popupAction === "plus" ? c : -c, m)} />}
      {showDecreasePopup && <ConfirmDecreaseModal onConfirm={() => { updateDefect(activeDecreaseIndex, -1); setShowDecreasePopup(false); }} onCancel={() => setShowDecreasePopup(false)} />}
      {showNeedlePopup && (
        <NeedleMeterPopup
          value={needleMeterValue}
          setValue={setNeedleMeterValue}
          onSave={() => {
            updateDefect(needleIndexRef.current, 1, needleMeterValue, `M-${needleMeterValue}`.toUpperCase());
            setNeedleMeterValue(""); setShowNeedlePopup(false);
          }}
          onClose={() => setShowNeedlePopup(false)}
        />
      )}

      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{ display: "none" }} onChange={handleImageCapture} />

      <div className="bg-white border rounded shadow-sm flex-grow-1 d-flex flex-column">
        {/* Header Section */}
        <div className="p-md-4 p-2">
          <div className="row g-0">
            <div className="col-12 col-lg-10 pe-lg-4">
              <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-2 g-md-3 mb-2 mb-md-4">
                <HeaderField label="MACHINE ID" value={id} />
                <HeaderField label="ROLL NO" value={rollNumber} />
                <HeaderField label="JOB NO" value={rollData?.jobno} />
                <HeaderField label="COLOR" value={rollData?.colour} />
                <HeaderField label="PONO" value={rollData?.pono} />
              </div>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-2 g-md-3 pb-2 pb-md-3 border-bottom">
                <HeaderField label="PDC REF" value={rollData?.pdcref} />
                <HeaderField label="FABRIC" value={rollData?.fabricdescription} />
                <HeaderField label="WEIGHT" value={rollData?.weight} />
                <HeaderField label="DIA" value={rollData?.dia} />
                <HeaderField label="LOOP LENGTH" value={rollData?.ll} />
              </div>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="fw-bold fs-4 font-monospace">{formatTime(time)}</div>
                <button className="btn btn-danger text-white fw-bold px-4 py-2 d-flex align-items-center gap-2 rounded-1"
                  disabled={isSubmitted}
                  onClick={() => setShowSubmitPopup(true)}>
                  <Save size={18} /> Submit
                </button>
              </div>  
            </div>
            {showSubmitPopup && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}>
                  <div className="bg-white p-4 rounded shadow text-center" style={{ width: "350px" }}>
                    
                    <div style={{ fontSize: "2rem" }}>⚠️</div>
                    <h5 className="fw-bold mt-2">Confirm Submit</h5>
                    <p className="text-muted">
                      Are you sure you want to submit this roll?
                    </p>

                    <div className="d-flex justify-content-center gap-3 mt-3">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowSubmitPopup(false)}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={async () => {
                          setIsSubmitted(true);

                          const finalPayload = {
                            ...getPayload(),
                            submit: true
                          };

                          payloadRef.current = finalPayload;

                          await fetch(`https://app.herofashion.com/coraroll/${rollNumber}/`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(finalPayload),
                          });

                          setShowSubmitPopup(false);
                          navigate(-1);
                        }}
                      >
                        Yes, Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            <div className="col-12 d-lg-none mt-2">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 py-2 flex-grow-1" onClick={() => cameraInputRef.current.click()}><Camera size={16} /> Image Capture</button>
                <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 py-2 flex-grow-1" onClick={() => setShowImage((prev) => !prev)}  ><ImageIcon size={16} /> View Images</button>
              </div>
            </div>

            <div className="col-lg-2 ps-4 border-start d-none d-lg-flex flex-column gap-2">
              <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 py-2" onClick={() => cameraInputRef.current.click()}><Camera size={16} /> Image Capture</button>
              <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 py-2" onClick={() => setShowImage((prev) => !prev)}><ImageIcon size={16} /> View Images</button>
              <div className="p-1 bg-white mt-1 text-center" style={{ height: "150px" }}>
                <div className="w-100 h-100 bg-light border d-flex align-items-center justify-content-center small text-muted">
                  {showImage && (previewImage || capturedImage) 
                   ? ( <img src={ previewImage ? previewImage : `https://app.herofashion.com${capturedImage}` } alt="Captured" className="w-100 h-100 object-fit-contain" /> )
                   : (<span style={{ fontSize: "0.7rem" }}>No Image</span> )}
                </div>
              </div>
            </div>
          </div>
        </div>  

        {/* Defect Grid */}
        <div className="bg-light border-top border-bottom flex-grow-1 d-flex flex-column overflow-hidden">
          <div className="d-none d-xl-flex h-100 overflow-auto">
            {defectTypes.map((defect, index) => (
              <div key={defect.id} className="d-flex flex-column border-end bg-white flex-shrink-0" style={{ flexGrow: 1, flexBasis: 0 }}>
                <div className="bg-light text-center py-2 border-bottom d-flex flex-column justify-content-center" style={{ height: "110px" }}>
                  <span className="fw-bold text-dark small">{defect.name}</span>
                  <span className="fw-bold text-secondary small">{defect.tamil}</span>
                  <span className="fw-bold text-secondary small">{defect.hindi}</span>
                </div>
                <div className="p-3 flex-grow-1 d-flex align-items-center justify-content-center">
                  {defect.img ? (
                    <div className="ratio ratio-1x1 border rounded overflow-hidden" style={{ maxWidth: "80px" }}>
                      <img src={defect.img} alt={defect.name} className="object-fit-cover" />
                    </div>
                  ) : <span className="text-muted small fst-italic">No Image</span>}
                </div>
                <div className="px-2 pb-2">
                  <input type="text" className="form-control form-control-sm text-center fw-bold" readOnly value={defectData[index].display || ""} />
                </div>
                <button onClick={() => handlePlusClick(index, defect.name)} className="btn btn-success rounded-0 d-flex align-items-center justify-content-center py-2"><Plus size={20} /></button>
                <button onClick={() => handleMinusClick(index, defect.name)} className="btn btn-danger d-flex align-items-center justify-content-center rounded-0 py-2"><Minus size={20} /></button>
              </div>
            ))}
          </div>

          <div className="d-xl-none d-flex flex-nowrap gap-2 p-2 overflow-auto">
            {defectTypes.map((defect, index) => (
              <div key={defect.id} style={{ minWidth: "170px" }}>
                <div className="d-flex flex-column border rounded bg-white h-100">
                  <div className="bg-light text-center py-2 border-bottom d-flex flex-column justify-content-center rounded-top">
                    <span className="fw-bold text-dark small">{defect.name}</span>
                    <span className="fw-bold text-secondary small">{defect.tamil}</span>
                    <span className="fw-bold text-secondary small">{defect.hindi}</span>
                  </div>
                  <div className="p-2 flex-grow-1 d-flex align-items-center justify-content-center">
                    {defect.img ? (
                      <div className="ratio ratio-1x1 border rounded overflow-hidden" style={{ maxWidth: "80px" }}>
                        <img src={defect.img} alt={defect.name} className="object-fit-cover" />
                      </div>
                    ) : <span className="text-muted small fst-italic" >No Image</span>}
                  </div>
                  <div className="px-1 pb-1">
                    <input type="text" className="form-control form-control-sm text-center fw-bold" readOnly value={defectData[index].display || ""} style={{ fontSize: "0.75rem" }} />
                  </div>
                    <button onClick={() => handlePlusClick(index, defect.name)} className="btn btn-success rounded-0 py-2 d-flex align-items-center justify-content-center"><Plus size={18} /></button>
                    <button onClick={() => handleMinusClick(index, defect.name)} className="btn btn-danger rounded-0 py-2 d-flex align-items-center justify-content-center"><Minus size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Remarks */}
        <div className="p-4 bg-white border-top">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <label className="fw-bold">Remarks:</label>
              <input type="text" className="form-control" placeholder="Type your remarks here..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const CountMeterModal = ({ onClose, onSave }) => {
  const [count, setCount] = useState(1);
  const [meter, setMeter] = useState("");
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 3000 }}>
      <div className="bg-white p-4 rounded-3 shadow" style={{ width: "430px" }}>
        <h4 className="text-center fw-bold mb-4">Count & Meter</h4>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <label className="fw-bold fs-5">Count:</label>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-danger fw-bold px-3" onClick={() => setCount(Math.max(1, count - 1))}>-</button>
            <input className="form-control text-center fw-bold" readOnly value={count} style={{ width: "80px" }} />
            <button className="btn btn-success fw-bold px-3" onClick={() => setCount(count + 1)}>+</button>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <label className="fw-bold fs-5">Meter:</label>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-danger fw-bold px-3" onClick={() => setMeter(prev => String(Math.max(0, Number(prev) - 1)))}>-</button>
            <input className="form-control text-center fw-bold" value={meter} onChange={(e) => setMeter(e.target.value)} style={{ width: "80px" }} />
            <button className="btn btn-success fw-bold px-3" onClick={() => setMeter(prev => String(Number(prev) + 1))}>+</button>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-3 mt-2">
          <button className="btn btn-light border fw-bold px-4" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary fw-bold px-4" onClick={() => onSave(count, meter)}>Save</button>
        </div>
      </div>
    </div>
  );
};

const NeedleMeterPopup = ({ value, setValue, onSave, onClose }) => (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}>
    <div className="bg-white p-4 rounded shadow" style={{ width: "350px" }}>
      <h5 className="text-center fw-bold mb-3">Enter meter value:</h5>
      <input className="form-control text-center fw-bold mb-4" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={onSave}>OK</button>
      </div>
    </div>
  </div>
);

const ConfirmDecreaseModal = ({ onConfirm, onCancel }) => (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}>
    <div className="bg-white p-4 rounded shadow text-center" style={{ width: "350px" }}>
      <div style={{ fontSize: "2rem" }}>⚠️</div>
      <h5 className="fw-bold mt-2">Confirm Action</h5>
      <p className="text-muted">Are you sure you want to decrease?</p>
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-success" onClick={onConfirm}>Yes</button>
        <button className="btn btn-secondary" onClick={onCancel}>No</button>
      </div>
    </div>
  </div>
);

export default QualityInspectionFullScreen;