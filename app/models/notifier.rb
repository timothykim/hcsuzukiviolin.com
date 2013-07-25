class Notifier < ActionMailer::Base

  def invoice(invoice)
    r = invoice.registration
    s = r.session

    recipients "tkim202@gmail.com"
    #recipients r.student.user.email
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    cc ["admin@hcsuzukiviolin.com","choi.hanna@gmail.com"]


    subject    "[HC Suzuki Studio] Invoice " + s.name
    body       :invoice => invoice, :sess => s, :reg => r
    content_type "text/html"
  end

  def signup_notification(new_account)
    admin = User.find(1)
<<<<<<< HEAD
    recipients admin.email_address_with_name
<<<<<<< HEAD
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] New account signup!"
=======
=======
    recipients admin.email
>>>>>>> deploy
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] New account signup!"
>>>>>>> deploy
    body       :admin => admin, :new_account => new_account
    content_type "text/html"
  end
  
  def activation_notification(account)
<<<<<<< HEAD
    recipients account.email_address_with_name
<<<<<<< HEAD
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] Your gwsms.org account has been activated!"
    body       :account => account
    content_type "text/html"
  end
=======
=======
    recipients account.email
>>>>>>> deploy
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] Your hcsuzukiviolin.com account has been activated!"
    body       :account => account
    content_type "text/html"
  end
  
  def reset_password_notification(account, password)
    recipients account.email
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] Your new hcsuzukiviolin.com account password."
    body       :account => account, :password => password
    content_type "text/html"
  end
>>>>>>> deploy
end
