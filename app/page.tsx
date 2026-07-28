"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import {
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  Facebook,
  Star,
  ShoppingBag,
  Wallet,
  Receipt,
  Smartphone,
  LifeBuoy,
  Zap,
  ScanLine,
} from "lucide-react"

// Indian Rupee formatter
const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const APP_LINK = "https://onelink.to/bcvnnr"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState("current")

  const [promoApi, setPromoApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

  // Simple auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }
    postHeight()
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)
    window.addEventListener("resize", postHeight)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  const orders = {
    current: {
      bookingId: "2216",
      bookingNo: "WGJHLNZ",
      cinema: "Cinepolis Ireo",
      orderDate: "07-05-2026",
      orderTime: "09:55 PM",
      paymentMethod: "Netbanking",
      items: [
        { name: "CINE SMILES 8PC NEW", qty: 1, price: 290.0 },
        { name: "SODAS 400ML", qty: 1, price: 460.0 },
      ],
      fbPrice: 750.0,
      cgst: 0.0,
      totalFbPrice: 750.0,
      totalOrderValue: 750.0,
      gstin: "06AADCC2076J1ZQ",
      hsn: "9996",
      sac: "9963",
      fssai: "10820005000077",
    },
    hist1: {
      bookingId: "2109",
      bookingNo: "WGJHK21",
      cinema: "Cinepolis Saket, New Delhi",
      orderDate: "16-06-2026",
      orderTime: "07:40 PM",
      paymentMethod: "UPI",
      items: [
        { name: "REGULAR POPCORN COMBO", qty: 1, price: 380.0 },
        { name: "COLD COFFEE 300ML", qty: 2, price: 320.0 },
      ],
      fbPrice: 700.0,
      cgst: 0.0,
      totalFbPrice: 700.0,
      totalOrderValue: 700.0,
      gstin: "07AADCC2076J1ZO",
      hsn: "9996",
      sac: "9963",
      fssai: "10820005000077",
    },
    hist2: {
      bookingId: "1988",
      bookingNo: "WGJH887",
      cinema: "Cinepolis Ireo",
      orderDate: "02-05-2026",
      orderTime: "06:10 PM",
      paymentMethod: "Credit Card",
      items: [
        { name: "NACHOS WITH CHEESE", qty: 1, price: 260.0 },
        { name: "MASALA POPCORN", qty: 1, price: 240.0 },
      ],
      fbPrice: 500.0,
      cgst: 0.0,
      totalFbPrice: 500.0,
      totalOrderValue: 500.0,
      gstin: "06AADCC2076J1ZQ",
      hsn: "9996",
      sac: "9963",
      fssai: "10820005000077",
    },
  }

  const currentOrder = orders[currentOrderId]

  const orderHistory = [
    { id: "current", date: orders.current.orderDate, label: `${orders.current.items.length} items`, amount: orders.current.totalOrderValue },
    { id: "hist1", date: orders.hist1.orderDate, label: `${orders.hist1.items.length} items`, amount: orders.hist1.totalOrderValue },
    { id: "hist2", date: orders.hist2.orderDate, label: `${orders.hist2.items.length} items`, amount: orders.hist2.totalOrderValue },
  ]

  const totalItemsCount = currentOrder.items.reduce((sum, item) => sum + item.qty, 0)

  const handleFeedbackSubmit = () => {
    if (!rating) {
      alert("Please select a rating before submitting.")
      return
    }
    setFeedbackSubmitted(true)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleEmailReceipt = () => {
    window.open(`mailto:?subject=Your Cinépolis F&B Order&body=Booking ID: ${currentOrder.bookingId}`)
  }

  const handleDownloadReceipt = () => {
    const itemRows = currentOrder.items
      .map(
        (item) => `<tr><td>${item.name}</td><td>${item.qty}</td><td>${fmt(item.price)}</td></tr>`
      )
      .join("")

    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Cinépolis F&B Bill</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Poppins',sans-serif;font-size:14px;color:#111;background:#fff;width:800px;margin:0 auto;padding:24px;}
.receipt-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:3px solid #7742D8;}
.company-info h1{font-size:30px;color:#3D1B78;font-weight:700;margin-bottom:4px;}
.company-info p{font-size:12px;color:#555;line-height:1.4;}
.bill-info{text-align:right;font-size:12px;}
.bill-info div{margin-bottom:4px;}
.bill-id{font-weight:600;color:#3D1B78;}
.order-section{background:#F4EEFD;padding:14px;border-left:4px solid #7742D8;border-radius:0 8px 8px 0;margin-bottom:22px;}
.order-section h3{font-size:16px;color:#3D1B78;font-weight:700;margin-bottom:2px;}
.order-section p{font-size:12px;color:#666;}
.items-table{width:100%;border-collapse:collapse;margin-bottom:24px;}
.items-table th{background:#3D1B78;color:#F9B233;padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.items-table td{padding:12px 8px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;}
.totals-table{text-align:right;min-width:220px;margin-left:auto;}
.totals-table div{margin-bottom:6px;font-size:13px;}
.net-total{font-size:18px;font-weight:700;color:#3D1B78;border-top:2px solid #F9B233;padding-top:6px;margin-top:6px;}
.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px dashed #ccc;font-size:12px;color:#555;}
.footer strong{color:#3D1B78;}
@media print{body{-webkit-print-color-adjust:exact;width:100%;padding:0;}}
</style>
</head>
<body>
<div class="receipt-header">
  <div class="company-info">
    <h1>cinépolis</h1>
    <p><strong>${currentOrder.cinema}</strong><br>F&amp;B Bill</p>
  </div>
  <div class="bill-info">
    <div><strong>Booking ID:</strong> <span class="bill-id">${currentOrder.bookingId}</span></div>
    <div><strong>Booking No.:</strong> ${currentOrder.bookingNo}</div>
    <div><strong>Order Date &amp; Time:</strong> ${currentOrder.orderDate} | ${currentOrder.orderTime}</div>
  </div>
</div>
<div class="order-section">
  <h3>Food &amp; Beverages</h3>
  <p>${currentOrder.items.length} items • Payment: ${currentOrder.paymentMethod}</p>
</div>
<table class="items-table">
  <thead><tr><th>Item Name</th><th>Qty</th><th>Total Price</th></tr></thead>
  <tbody>
    ${itemRows}
  </tbody>
</table>
<div class="totals-table">
  <div>F&amp;B Price: ${fmt(currentOrder.fbPrice)}</div>
  <div>CGST (2.5%): ${fmt(currentOrder.cgst)}</div>
  <div class="net-total">Total Order Value: ${fmt(currentOrder.totalOrderValue)}</div>
</div>
<div class="footer">
  <p><strong>Enjoy your snacks! See you again at Cinépolis.</strong></p>
  <p>GSTIN: ${currentOrder.gstin} | HSN: ${currentOrder.hsn} | SAC: ${currentOrder.sac}</p>
  <p>FSSAI: ${currentOrder.fssai}</p>
  <p style="margin-top:8px;">Powered by SmartBill</p>
</div>
</body>
</html>
  `
    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Cinepolis_FnB_Bill_${currentOrder.bookingId}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadApp = () => window.open(APP_LINK, "_blank")
  const handleNeedHelp = () => window.open("https://wa.me/+919620921294", "_blank")
  const handleEmail = () => window.open("mailto:sagar.p@proenx.com", "_blank")
  const handleSocialLink = (url: string) => window.open(url, "_blank")

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden font-poppins"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#3D1B78] via-[#5B2A9E] to-[#7742D8] px-5 pt-6 pb-8 mt-4 mx-3 rounded-2xl text-center text-white">
            <img
              src="/images/design-mode/Cinepolis-Logo.png"
              alt="Cinépolis"
              className="h-9 w-auto mx-auto mb-2"
            />
            <div className="text-xs font-semibold tracking-[0.15em] uppercase opacity-90">{currentOrder.cinema}</div>
          </div>

          {/* Order Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mx-3 -mt-5 overflow-hidden relative">

            {/* Order QR */}
            <div className="pt-6 pb-5 px-5 text-center">
              <span className="inline-block bg-[#F9B233] text-black text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-4">
                <ScanLine className="inline h-3 w-3 mr-1 -mt-0.5" />
                Tax Invoice
              </span>

              <h2 className="text-lg font-bold text-gray-900 mb-1">Tax Invoice</h2>
              <p className="text-xs text-gray-500 mb-4">Scan the QR code at the entrance of the cinema</p>

              <div className="flex justify-center">
                <div className="p-3 border-2 border-[#F9B233] rounded-2xl">
                  <Image
                    src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                    alt="QR Code"
                    width={160}
                    height={160}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-8 text-left">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Booking ID</div>
                  <div className="text-xs font-semibold text-gray-900">{currentOrder.bookingId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Booking No.</div>
                  <div className="text-xs font-semibold text-gray-900">{currentOrder.bookingNo}</div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-gray-500">
                Order Date &amp; Time: {currentOrder.orderDate} | {currentOrder.orderTime}
              </div>

              <div className="mt-4 bg-[#F4EEFD] border border-[#DCC7F5] rounded-xl px-3 py-2.5 text-[11px] text-[#3D1B78] font-medium">
                For F&amp;B orders, please check in through the app upon arriving at the cinema so we can begin preparing your order.
              </div>
            </div>

            {/* Perforation / tear line */}
            <div className="relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />
              <div className="border-t-2 border-dashed border-gray-200 mx-6" />
            </div>

            {/* Order Summary Chips */}
            <div className="px-5 pt-5 pb-6">
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#7742D8] mb-3">Food &amp; Beverages</div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200">
                  <ShoppingBag className="h-4 w-4 text-[#7742D8] mx-auto mb-1" />
                  <div className="text-[10px] text-gray-500">Items</div>
                  <div className="text-sm font-semibold text-gray-900">{totalItemsCount}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200">
                  <Wallet className="h-4 w-4 text-[#7742D8] mx-auto mb-1" />
                  <div className="text-[10px] text-gray-500">Payment</div>
                  <div className="text-sm font-semibold text-gray-900">{currentOrder.paymentMethod}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200">
                  <Receipt className="h-4 w-4 text-[#7742D8] mx-auto mb-1" />
                  <div className="text-[10px] text-gray-500">Total</div>
                  <div className="text-sm font-semibold text-gray-900">{fmt(currentOrder.totalOrderValue)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Line Items */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mx-3 p-4">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Item Details</div>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-1 border-b border-gray-100">
                <span>Item Name</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Total Price</span>
              </div>
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-2 text-sm">
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="text-center text-gray-600">x{item.qty}</span>
                  <span className="text-right text-gray-900 font-semibold">{fmt(item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mx-3 p-4">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Cost Breakup</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">F&amp;B Price</span><span>{fmt(currentOrder.fbPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">CGST (2.5%)</span><span>{fmt(currentOrder.cgst)}</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-600">Total F&amp;B Price</span><span>{fmt(currentOrder.totalFbPrice)}</span></div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Order Value</span><span className="text-[#3D1B78]">{fmt(currentOrder.totalOrderValue)}</span>
              </div>
            </div>
          </div>

          {/* Promo Banners — 1600x485 aspect ratio */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mx-3 relative">
            <Carousel className="w-full" setApi={setPromoApi} opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative w-full aspect-[1600/485] bg-[#F4EEFD]">
                    <a href="https://www.instagram.com/cinepolisindia/?hl=en" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                      <Image src="/images/design-mode/cinepolis-food-banner-1.png" alt="Now at Cinépolis Snack Bar" fill className="object-cover" priority />
                    </a>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative w-full aspect-[1600/485] bg-[#F4EEFD]">
                    <a href="https://www.instagram.com/cinepolisindia/?hl=en" target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                      <Image src="/images/design-mode/cinepolis-gift-card-banner-2.png" alt="Cinépolis Gift Cards" fill className="object-cover" />
                    </a>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {[0, 1].map((index) => (
                  <button key={index} onClick={() => promoApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? "w-5 bg-[#F9B233]" : "w-1.5 bg-white/70"}`} />
                ))}
              </div>
            </Carousel>
          </div>

          {/* Rate Experience */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 p-4">
            {feedbackSubmitted ? (
              <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Thanks for your feedback!</div>
                <div className="text-xs text-gray-500">Your input helps us improve every Cinépolis order.</div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900 text-center">Rate Your Experience</h3>

                <div className="flex justify-center gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star)
                        setSelectedTags([])
                      }}
                      className="transition-transform active:scale-90"
                    >
                      <Star className={`h-8 w-8 transition-colors ${star <= rating ? "fill-[#F9B233] text-[#F9B233]" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide text-center">Tell us more</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(rating >= 4
                        ? ["Fresh & tasty", "Quick pickup", "Good portion size", "Friendly staff"]
                        : ["Order was cold", "Long wait time", "Wrong item", "Staff behaviour"]
                      ).map((item) => (
                        <button key={item}
                          onClick={() => setSelectedTags((prev) => prev.includes(item) ? prev.filter((tag) => tag !== item) : [...prev, item])}
                          className={`text-[11px] px-3 py-1.5 rounded-full border transition ${selectedTags.includes(item) ? "bg-[#3D1B78] text-white border-[#3D1B78]" : "border-gray-200 bg-gray-50"}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea rows={2} placeholder="Additional feedback (optional)"
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#7742D8] focus:border-[#7742D8] outline-none resize-none"
                  value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />

                <button className="w-full bg-[#F9B233] hover:bg-[#e8a422] text-black h-10 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
                  onClick={handleFeedbackSubmit} disabled={!rating}>
                  Submit Feedback
                </button>
              </div>
            )}
          </div>

          {/* Download App CTA */}
          <div className="bg-gradient-to-br from-[#3D1B78] via-[#5B2A9E] to-[#7742D8] rounded-2xl shadow-md mx-3 p-5 text-white">
            <div className="flex items-center">
              <div className="bg-white/15 p-3 rounded-xl mr-4">
                <Smartphone className="h-6 w-6 text-[#F9B233]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Get the Cinépolis App</div>
                <div className="text-[11px] opacity-80">Book faster, pre-order snacks & manage bookings on the go</div>
              </div>
            </div>
            <button onClick={handleDownloadApp}
              className="w-full mt-4 bg-[#F9B233] hover:bg-[#e8a422] text-black h-10 text-xs font-bold rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download App
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 p-4">
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowOrderHistory(true)}
                className="flex flex-col items-center justify-center bg-[#F4EEFD] border border-[#DCC7F5] rounded-xl py-3 active:scale-[0.98]">
                <History className="h-5 w-5 text-[#3D1B78] mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Orders</span>
              </button>
              <button onClick={handleEmailReceipt}
                className="flex flex-col items-center justify-center bg-[#F4EEFD] border border-[#DCC7F5] rounded-xl py-3 active:scale-[0.98]">
                <Mail className="h-5 w-5 text-[#3D1B78] mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Email</span>
              </button>
              <button onClick={handleDownloadReceipt}
                className="flex flex-col items-center justify-center bg-[#F4EEFD] border border-[#DCC7F5] rounded-xl py-3 active:scale-[0.98]">
                <FileText className="h-5 w-5 text-[#3D1B78] mb-1" />
                <span className="text-[11px] font-medium text-gray-700">Bill</span>
              </button>
            </div>
          </div>

          {/* Help row — Terms & Not your bill */}
          <div className="mx-3 grid grid-cols-2 gap-3">
            <button onClick={() => setShowTerms(!showTerms)}
              className="bg-white border border-gray-200 rounded-full py-2.5 text-xs font-semibold text-gray-700 shadow-sm active:scale-[0.98]">
              Terms & Conditions
            </button>
            <button onClick={handleNeedHelp}
              className="bg-white border border-gray-200 rounded-full py-2.5 text-xs font-semibold text-gray-700 shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5">
              <LifeBuoy className="h-3.5 w-3.5" />
              Not your bill?
            </button>
          </div>

          {showTerms && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 p-4 text-[11px] text-gray-500 space-y-1 font-medium">
              <p>• F&B orders once placed cannot be exchanged or refunded, subject to cinema policy.</p>
              <p>• Please collect your order at the counter within the show interval.</p>
              <p>• Pickup is permitted only against a valid QR code / order ID.</p>
              <p>• For support visit www.cinepolisindia.com.</p>
            </div>
          )}

          {/* GST / HSN / SAC / FSSAI */}
          <div className="mx-3 text-center text-[10px] text-gray-400 leading-relaxed">
            GSTIN: {currentOrder.gstin}<br />
            HSN: {currentOrder.hsn} &nbsp;|&nbsp; SAC: {currentOrder.sac}<br />
            FSSAI: {currentOrder.fssai}
          </div>

          {/* Stay Connected */}
          <div className="flex justify-center gap-6 mx-3">
            <button onClick={() => handleSocialLink("https://www.instagram.com/cinepolisindia/?hl=en")} className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center mb-1">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Instagram</span>
            </button>
            <button onClick={() => handleSocialLink("https://www.facebook.com/CinepolisIndia")} className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center mb-1">
                <Facebook className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Facebook</span>
            </button>
            <button onClick={() => handleSocialLink("https://www.cinepolisindia.com")} className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#3D1B78] flex items-center justify-center mb-1">
                <ExternalLink className="h-4 w-4 text-[#F9B233]" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Website</span>
            </button>
          </div>

          {/* Powered By footer */}
          <div className="flex items-center justify-center gap-1.5 py-2 text-gray-400">
            <Zap className="h-3 w-3 fill-gray-300" />
            <span className="text-[10px] font-medium">Digital billing powered by <span className="font-bold text-gray-500">SmartBill</span></span>
          </div>

          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Order History Modal */}
        {showOrderHistory && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowOrderHistory(false)} />
            <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-[#3D1B78] p-2 rounded-lg mr-3">
                    <History className="h-4 w-4 text-[#F9B233]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Order History</h3>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={() => setShowOrderHistory(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-gray-500">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {orderHistory.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setCurrentOrderId(order.id)
                      setShowOrderHistory(false)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="w-full flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#7742D8] transition"
                  >
                    <div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
                      <ShoppingBag className="h-4 w-4 text-[#3D1B78]" />
                    </div>
                    <div className="flex-grow text-left">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-1">{order.label}</div>
                      <div className="text-[11px] text-gray-500">{order.date}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#3D1B78]">{fmt(order.amount)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
