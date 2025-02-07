using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebCourierAPI.Models;

public partial class WebCorierApiContext : DbContext
{
    public WebCorierApiContext()
    {
    }

    public WebCorierApiContext(DbContextOptions<WebCorierApiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Bank> Banks { get; set; }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<BranchesStaff> BranchesStaffs { get; set; }

    public virtual DbSet<Company> Companys { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<DeliveryCharge> DeliveryCharges { get; set; }

    public virtual DbSet<Designation> Designations { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<Parcel> Parcels { get; set; }

    public virtual DbSet<ParcelType> ParcelTypes { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Receiver> Receivers { get; set; }

    public virtual DbSet<Staff> Staffs { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

    public virtual DbSet<Van> Vans { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-IRCUGIO;Initial Catalog=WebCorierApi;User id=sa;Password=12345; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bank>(entity =>
        {
            entity.HasIndex(e => e.CompanyId, "IX_Banks_companyId");

            entity.Property(e => e.BankId).HasColumnName("bankId");
            entity.Property(e => e.AccountNo).HasColumnName("accountNo");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.BranchName).HasColumnName("branchName");
            entity.Property(e => e.CompanyId).HasColumnName("companyId");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");

            entity.HasOne(d => d.Company).WithMany(p => p.Banks)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasIndex(e => e.ParentId, "IX_Branches_ParentId");

            entity.Property(e => e.BranchId).HasColumnName("branchId");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.BranchName).HasColumnName("branchName");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasForeignKey(d => d.ParentId);
        });

        modelBuilder.Entity<BranchesStaff>(entity =>
        {
            entity.HasKey(e => e.BranchStaffId);

            entity.HasIndex(e => e.StaffId, "IX_BranchesStaffs_staffId");

            entity.Property(e => e.BranchStaffId).HasColumnName("branchStaffId");
            entity.Property(e => e.BranchStaffName).HasColumnName("branchStaffName");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.StaffId).HasColumnName("staffId");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");

            entity.HasOne(d => d.Staff).WithMany(p => p.BranchesStaffs).HasForeignKey(d => d.StaffId);
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.Property(e => e.CompanyId).HasColumnName("companyId");
            entity.Property(e => e.CompanyName).HasColumnName("companyName");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CustomerEmail).HasColumnName("customerEmail");
            entity.Property(e => e.CustomerMobile).HasColumnName("customerMobile");
            entity.Property(e => e.CustomerName).HasColumnName("customerName");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
        });

        modelBuilder.Entity<DeliveryCharge>(entity =>
        {
            entity.HasIndex(e => e.ParcelTypeId, "IX_DeliveryCharges_parcelTypeId");

            entity.Property(e => e.DeliveryChargeId).HasColumnName("deliveryChargeId");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.ParcelTypeId).HasColumnName("parcelTypeId");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("price");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
            entity.Property(e => e.Weight).HasColumnName("weight");

            entity.HasOne(d => d.ParcelType).WithMany(p => p.DeliveryCharges)
                .HasForeignKey(d => d.ParcelTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Designation>(entity =>
        {
            entity.Property(e => e.DesignationId).HasColumnName("designationId");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasIndex(e => e.ParcelsId, "IX_Invoices_ParcelsId");

            entity.HasIndex(e => e.PaymentMethodId, "IX_Invoices_paymentMethodId");

            entity.Property(e => e.InvoiceId).HasColumnName("invoiceId");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Particular).HasColumnName("particular");
            entity.Property(e => e.PaymentMethodId).HasColumnName("paymentMethodId");
            entity.Property(e => e.PaymentTime).HasColumnName("paymentTime");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");

            entity.HasOne(d => d.Parcels).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.ParcelsId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Invoices).HasForeignKey(d => d.PaymentMethodId);
        });

        modelBuilder.Entity<Parcel>(entity =>
        {
            entity.HasIndex(e => e.DeliveryChargeId, "IX_Parcels_deliveryChargeId");

            entity.HasIndex(e => e.ParcelTypeId, "IX_Parcels_parcelTypeId");

            entity.HasIndex(e => e.ReceiverBranchId, "IX_Parcels_receiverBranchId");

            entity.HasIndex(e => e.ReceiverCustomerId, "IX_Parcels_receiverCustomerId");

            entity.HasIndex(e => e.SenderBranchId, "IX_Parcels_senderBranchId");

            entity.HasIndex(e => e.SenderCustomerId, "IX_Parcels_senderCustomerId");

            entity.HasIndex(e => e.VanId, "IX_Parcels_vanId");

            entity.Property(e => e.ParcelId).HasColumnName("parcelId");
            entity.Property(e => e.CreateBy).HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.DeliveryChargeId).HasColumnName("deliveryChargeId");
            entity.Property(e => e.DriverId).HasColumnName("driverId");
            entity.Property(e => e.EstimatedReceiveTime)
                .HasColumnType("datetime")
                .HasColumnName("estimatedReceiveTime");
            entity.Property(e => e.ParcelTypeId).HasColumnName("parcelTypeId");
            entity.Property(e => e.PercelSendingDestribution).HasColumnName("percelSendingDestribution");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("price");
            entity.Property(e => e.RecebingBranch).HasColumnName("recebingBranch");
            entity.Property(e => e.RecebingDistributin).HasColumnName("recebingDistributin");
            entity.Property(e => e.RecebingReceber).HasColumnName("recebingReceber");
            entity.Property(e => e.ReceiveTime)
                .HasColumnType("datetime")
                .HasColumnName("receiveTime");
            entity.Property(e => e.ReceiverAddress)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("receiverAddress");
            entity.Property(e => e.ReceiverAlternativetoAddress)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("receiverAlternativetoAddress");
            entity.Property(e => e.ReceiverBranchId).HasColumnName("receiverBranchId");
            entity.Property(e => e.ReceiverCustomerId).HasColumnName("receiverCustomerId");
            entity.Property(e => e.ReceiverEmail)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("receiverEmail");
            entity.Property(e => e.ReceiverName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("receiverName");
            entity.Property(e => e.ReceiverPhone).HasColumnName("receiverPhone");
            entity.Property(e => e.SendTime)
                .HasColumnType("datetime")
                .HasColumnName("sendTime");
            entity.Property(e => e.SenderAddress)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("senderAddress");
            entity.Property(e => e.SenderAlternativetoAddress)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("senderAlternativetoAddress");
            entity.Property(e => e.SenderBranchId).HasColumnName("senderBranchId");
            entity.Property(e => e.SenderCustomerId).HasColumnName("senderCustomerId");
            entity.Property(e => e.SenderName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("senderName");
            entity.Property(e => e.SenderPhone).HasColumnName("senderPhone");
            entity.Property(e => e.SendingBranch).HasColumnName("sendingBranch");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
            entity.Property(e => e.VanId).HasColumnName("vanId");
            entity.Property(e => e.Weight).HasColumnName("weight");

            entity.HasOne(d => d.DeliveryCharge).WithMany(p => p.Parcels).HasForeignKey(d => d.DeliveryChargeId);

            entity.HasOne(d => d.ParcelType).WithMany(p => p.Parcels).HasForeignKey(d => d.ParcelTypeId);

            entity.HasOne(d => d.ReceiverBranch).WithMany(p => p.ParcelReceiverBranches).HasForeignKey(d => d.ReceiverBranchId);

            entity.HasOne(d => d.ReceiverCustomer).WithMany(p => p.Parcels).HasForeignKey(d => d.ReceiverCustomerId);

            entity.HasOne(d => d.SenderBranch).WithMany(p => p.ParcelSenderBranches).HasForeignKey(d => d.SenderBranchId);

            entity.HasOne(d => d.SenderCustomer).WithMany(p => p.Parcels).HasForeignKey(d => d.SenderCustomerId);

            entity.HasOne(d => d.Van).WithMany(p => p.Parcels).HasForeignKey(d => d.VanId);
        });

        modelBuilder.Entity<ParcelType>(entity =>
        {
            entity.Property(e => e.ParcelTypeId).HasColumnName("parcelTypeId");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.DefaultPrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("defaultPrice");
            entity.Property(e => e.ParcelTypeName).HasColumnName("parcelTypeName");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.Property(e => e.PaymentMethodId).HasColumnName("paymentMethodId");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.PaymentMethodType).HasColumnName("paymentMethodType");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
        });

        modelBuilder.Entity<Receiver>(entity =>
        {
            entity.Property(e => e.ReceiverId).HasColumnName("receiverId");
            entity.Property(e => e.ReceiverName).HasColumnName("receiverName");
            entity.Property(e => e.ReceiverPhoneNumber).HasColumnName("receiverPhoneNumber");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasIndex(e => e.DesignationId, "IX_Staffs_designationId");

            entity.Property(e => e.StaffId).HasColumnName("staffId");
            entity.Property(e => e.BranchId).HasColumnName("branchId");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("createDate");
            entity.Property(e => e.DesignationId).HasColumnName("designationId");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.StaffName).HasColumnName("staffName");
            entity.Property(e => e.StaffPhone)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("staffPhone");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");

            entity.HasOne(d => d.Branch).WithMany(p => p.Staff)
                .HasForeignKey(d => d.BranchId)
                .HasConstraintName("FK_Staffs_Branches");

            entity.HasOne(d => d.Designation).WithMany(p => p.Staff)
                .HasForeignKey(d => d.DesignationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__UserDeta__1788CC4C94809381");

            entity.ToTable("UserDetail");

            entity.Property(e => e.PassWord)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UserName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Van>(entity =>
        {
            entity.Property(e => e.VanId).HasColumnName("vanId");
            entity.Property(e => e.CreateBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createBy");
            entity.Property(e => e.CreateDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("createDate");
            entity.Property(e => e.RegistrationNo).HasColumnName("registrationNo");
            entity.Property(e => e.UpdateBy).HasColumnName("updateBy");
            entity.Property(e => e.UpdateDate).HasColumnName("updateDate");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
