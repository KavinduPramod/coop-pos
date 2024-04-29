package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;


import com.sunmi.peripheral.printer.SunmiPrinterService;

public class MainActivity extends AppCompatActivity {
    private WebView mWebView;
    private SunmiPrinterService woyouService;
    private boolean isServiceConnected = false;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mWebView = findViewById(R.id.webView);
        mWebView.getSettings().setDefaultTextEncodingName("utf-8");
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.setWebViewClient(new WebViewClientDemo()); // Use the custom WebViewClientDemo
        // Load the HTML file from assets
        // Check network connectivity
        if (isNetworkAvailable()) {
            // Load the HTML file from assets
            mWebView.loadUrl("https://jade-travesseiro-c53f34.netlify.app/");
            mWebView.addJavascriptInterface(new JsObject(), "lee");
        } else {
            // Handle offline scenario
            Toast.makeText(getApplicationContext(), "You are offline. Please check your internet connection.", Toast.LENGTH_SHORT).show();
            mWebView.loadUrl("file:///android_asset/test.html");
            mWebView.addJavascriptInterface(new JsObject(), "lee");
        }
    }


    // Method to check network connectivity
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager != null) {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }
        return false;
    }

    // Custom WebViewClient to handle page loading and adding JavascriptInterface
    private class WebViewClientDemo extends WebViewClient {

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            // Register JavascriptInterface after page load finishes
            mWebView.addJavascriptInterface(new JsObject(), "lee");
        }
    }

    // JavaScript Interface class to be used in WebView
    // JavaScript Interface class to be used in WebView
    public class JsObject {
        // Method to be called from JavaScript
        @JavascriptInterface
        public void funAndroid(String username, String date, String price) {
            // This method will be called when the JavaScript function is invoked
            // Use this method to handle the data received from JavaScript
            Toast.makeText(getApplicationContext(), "Received data from JavaScript", Toast.LENGTH_SHORT).show();

            // Additional logic for printing via AIDL or Bluetooth can be implemented here
            if (isServiceConnected) {
                initializePrintService(username,date,price);
            } else {
                Toast.makeText(getApplicationContext(), "Printer service is not connected yet", Toast.LENGTH_SHORT).show();
            }
        }

        // Method to initialize print service and print the receipt
        private void initializePrintService(String username, String date, String price) {
            if (woyouService == null) {
                Toast.makeText(getApplicationContext(), "Printer service is not available", Toast.LENGTH_SHORT).show();
                return;
            }
            try {
                // Set alignment to center
                woyouService.setAlignment(1, null); // 1 for center alignment

                // Set custom font and increase font size
                woyouService.setFontName("gh", null); // Assuming "gh" is the custom font
                woyouService.setFontSize(40, null); // Increase font size to 40

                // Create the receipt content
                String receiptContent = "";

                // Bold labels and append to receipt content
                receiptContent += "Username: " + username + "\n";
                receiptContent += "Date: " + date + "\n"; // Assuming you want the date in string format
                receiptContent += "Price: " + price + "\n"; // Assuming you want the price in string format

                Log.d("PrintData", "Printing Initialized");
                // Print the receipt content
                woyouService.printText(receiptContent, null);
                woyouService.lineWrap(3, null); // Advance the paper by 5 lines (adjust as needed)

                // Disconnect the service after printing
                unbindService(connService);
                bindPrinterService();
            } catch (RemoteException e) {
                e.printStackTrace();
                Log.e("PrintingException", "Error occurred while printing", e);
            }
        }



    }

    // Binding service for printer
    private ServiceConnection connService = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            woyouService = SunmiPrinterService.Stub.asInterface(iBinder);
            Log.d("PrinterService", "Service connected");
            isServiceConnected = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            woyouService = null;
            Log.d("PrinterService", "Service disconnected");
            isServiceConnected = false;
        }
    };

    // Method to initialize print service and print the receipt
    private void initializePrintService(Bitmap receiptData) {
        if (woyouService == null) {
            Toast.makeText(getApplicationContext(), "Printer service is not available", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            Log.d("String", "Printing Initialized");
            // Advance the paper by 5 lines (adjust as needed)
            woyouService.printBitmap(receiptData, null);
            woyouService.lineWrap(5, null);
            // Disconnect the service after printing
            unbindService(connService);
            bindPrinterService();
        } catch (RemoteException e) {
            e.printStackTrace();
            Log.e("PrintingException", "Error occurred while printing", e);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        bindPrinterService();
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(connService);
    }

    private void bindPrinterService() {
        Intent intent = new Intent();
        intent.setPackage("woyou.aidlservice.jiuiv5");
        intent.setAction("woyou.aidlservice.jiuiv5.IWoyouService");
        bindService(intent, connService, Context.BIND_AUTO_CREATE);
    }
}
