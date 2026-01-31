import { useRef } from 'react';
import { X, CreditCard, Download, CheckCircle, AlertCircle } from 'lucide-react';

const BillingHistoryModal = ({ isOpen, onClose }) => {
    const bills = [
        {
            id: 'BILL123',
            description: 'Consultation Fee',
            date: '2024-01-24',
            amount: 1500,
            status: 'Pending',
            paymentMethod: '-'
        },
        {
            id: 'BILL110',
            description: 'Lab Test - Blood Work',
            date: '2023-12-10',
            amount: 850,
            status: 'Paid',
            paymentMethod: 'Credit Card'
        },
        {
            id: 'BILL095',
            description: 'General Checkup',
            date: '2023-11-05',
            amount: 500,
            status: 'Paid',
            paymentMethod: 'UPI'
        }
    ];

    const generateInvoice = (bill) => {
        const printWindow = window.open('', '', 'height=800,width=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${bill.id}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                        .title { font-size: 24px; font-weight: bold; color: #2563eb; }
                        .meta { margin-top: 10px; color: #666; }
                        .amount-box { background: #f8fafc; padding: 20px; border-radius: 10px; text-align: right; margin: 30px 0; }
                        .total { font-size: 32px; font-weight: bold; color: #0f172a; }
                        .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
                        .paid { background: #dcfce7; color: #166534; }
                        .pending { background: #ffedd5; color: #9a3412; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">INVOICE</div>
                        <div class="meta">#${bill.id} • ${new Date(bill.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <h3>Billing Details</h3>
                        <p>${bill.description}</p>
                    </div>
                    <div class="amount-box">
                        <div>Total Amount</div>
                        <div class="total">₹${bill.amount}</div>
                        <div style="margin-top: 10px;">
                            <span class="status ${bill.status === 'Paid' ? 'paid' : 'pending'}">${bill.status}</span>
                        </div>
                    </div>
                    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 50px;">Thank you for choosing our hospital services.</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-blue-600 px-8 py-6 flex justify-between items-center shrink-0">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CreditCard /> Billing History
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Your payment transactions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">
                    {bills.map((bill) => (
                        <div key={bill.id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl gap-4 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white
                                    ${bill.status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                    {bill.status === 'Paid' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{bill.description}</h4>
                                    <p className="text-sm text-gray-500">{bill.date} • {bill.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">₹{bill.amount}</p>
                                    <span className={`text-xs font-bold uppercase tracking-wider
                                        ${bill.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {bill.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => generateInvoice(bill)}
                                    className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                    title="Download Invoice"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BillingHistoryModal;
