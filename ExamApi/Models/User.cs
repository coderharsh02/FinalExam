﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace ExamApi.Models
{
    public partial class User
    {
        public User()
        {
            UserLeaveHistory = new HashSet<UserLeaveHistory>();
        }

        public string UserName { get; set; }
        public string Password { get; set; }
        public int Role { get; set; }

        public virtual UserLeaveBalance UserLeaveBalance { get; set; }
        public virtual ICollection<UserLeaveHistory> UserLeaveHistory { get; set; }
    }
}