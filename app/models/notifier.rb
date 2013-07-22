class Notifier < ActionMailer::Base

  def signup_notification(new_account)
    admin = User.find(1)
    recipients admin.email_address_with_name
<<<<<<< HEAD
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] New account signup!"
=======
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] New account signup!"
>>>>>>> deploy
    body       :admin => admin, :new_account => new_account
    content_type "text/html"
  end
  
  def activation_notification(account)
    recipients account.email_address_with_name
<<<<<<< HEAD
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] Your gwsms.org account has been activated!"
    body       :account => account
    content_type "text/html"
  end
=======
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] Your hcsuzukiviolin.com account has been activated!"
    body       :account => account
    content_type "text/html"
  end
  
  def reset_password_notification(account, password)
    recipients account.email_address_with_name
    from       "\"HCSuzukiViolin.com Administrator\" <admin@hcsuzukiviolin.com>"
    subject    "[HC Suzuki Studio] Your new hcsuzukiviolin.com account password."
    body       :account => account, :password => password
    content_type "text/html"
  end
>>>>>>> deploy
end
