using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public DateTime PaymentTime { get; set; }

    public decimal Amount { get; set; }

    public string? Particular { get; set; }

    public string CreateBy { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int PaymentMethodId { get; set; }

    public int ParcelsId { get; set; }

    public virtual Parcel Parcels { get; set; } = null!;

    public virtual PaymentMethod PaymentMethod { get; set; } = null!;
}
